import { AnnualEmployeeSheetNotFoundException } from '@fiscal/exceptions/annual-employee-sheet.exceptions';
import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { AnnualEmployeeSheetRepository } from '@fiscal/repositories/annual-employee-sheet.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { DateClosedInterval } from '@shared/models/date/date-closed-interval';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { CreateVacationRequestCommand } from '@vacations/commands/impl/create-vacation-request.command';
import { FailedToCreateVacationRequestEvent } from '@vacations/events/impl/failed-to-create-vacation-request.event';
import { VacationRequestCreatedEvent } from '@vacations/events/impl/vacation-request-created.event';
import { OverlappingVacationDatesException } from '@vacations/exceptions/vacation.exceptions';
import { Holiday } from '@vacations/models/holiday';
import { Vacation } from '@vacations/models/vacation';
import { HolidayRepository } from '@vacations/repositories/holiday.repository';
import { VacationRepository } from '@vacations/repositories/vacation.repository';
import { sumBy } from 'lodash';
import { DataSource, EntityManager } from 'typeorm';

@CommandHandler( CreateVacationRequestCommand )
export class CreateVacationRequestHandler extends BaseSyncCommandHandler<CreateVacationRequestCommand, Vacation> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly annualEmployeeSheetRepository: AnnualEmployeeSheetRepository,
        private readonly vacationRepository: VacationRepository,
        private readonly holidayRepository: HolidayRepository,
        private readonly dataSource: DataSource
    ) {
        super();
    }

    async execute(command: CreateVacationRequestCommand): Promise<Result<Vacation>> {
        const annualEmployeeSheetPromise = this.getCurrentAnnualEmployeeSheet( command );
        const workDayHolidaysPromise = this.getAllWorkDayHolidays();

        const annualEmployeeSheetResult = await annualEmployeeSheetPromise;
        const workDayHolidaysResult = await workDayHolidaysPromise;

        if( annualEmployeeSheetResult.isFailed ) {
            return this.failed( command, ...annualEmployeeSheetResult.errors );
        }

        if( workDayHolidaysResult.isFailed ) {
            return this.failed( command, ...workDayHolidaysResult.errors );
        }

        const annualEmployeeSheet = annualEmployeeSheetResult.value!;
        const workDayHolidays = workDayHolidaysResult.value!;
        const otherUserVacationsResult = await this.getAllUserVacationsByCurrentAnnualEmployeeSheet( annualEmployeeSheet );

        if( otherUserVacationsResult.isFailed ) {
            return this.failed( command, ...otherUserVacationsResult.errors );
        }

        const otherUserVacations = otherUserVacationsResult.value!;
        const workingDays = this.calculateTotalWorkingDays( command, workDayHolidays );

        if( workingDays.isFailed ) {
            return this.failed( command, ...workingDays.errors );
        }

        const vacationResult = Vacation.create( command, workingDays.value!, annualEmployeeSheet );

        if( vacationResult.isFailed ) {
            return this.failed( command, ...vacationResult.errors );
        }

        const vacation = vacationResult.value!;
        const vacationRequestValidation = this.validateVacationRequest( vacation, otherUserVacations );

        if( vacationRequestValidation.isFailed ) {
            return this.failed( command, ...vacationRequestValidation.errors );
        }

        let updatedAnnualEmployeeSheet: Result<AnnualEmployeeSheet>;

        if( vacation.isPaid() ) {
            updatedAnnualEmployeeSheet = annualEmployeeSheet.updateRemainingPaidLeaveDays( command, vacation );

            if( updatedAnnualEmployeeSheet.isFailed ) {
                return this.failed( command, ...updatedAnnualEmployeeSheet.errors );
            }
        }

        return await this.dataSource.transaction( async (entityManager: EntityManager) => {
            const savedVacation = await this.saveVacationToDb( vacation, entityManager );

            if( savedVacation.isPaid() ) {
                await this.saveAnnualEmployeeSheetToDb( updatedAnnualEmployeeSheet!.value!, entityManager );
            }

            return this.successful( command, savedVacation );
        } );
    }

    protected successful(command: CreateVacationRequestCommand, vacation: Vacation): Result<Vacation> {
        const { context } = command.data;
        const event = new VacationRequestCreatedEvent( { context, payload: vacation } );

        this.eventBus.publish( event );

        return Success( vacation );
    }

    protected failed(command: CreateVacationRequestCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateVacationRequestEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getCurrentAnnualEmployeeSheet(command: CreateVacationRequestCommand): Promise<Result<AnnualEmployeeSheet>> {
        const { context: { user } } = command.data;
        const sheet = await this.annualEmployeeSheetRepository.findCurrentByUserId( user.id );

        if( sheet.isFailed ) {
            throw new Exception( sheet.errors );
        }

        if( sheet.isNotFound ) {
            return Failed( new AnnualEmployeeSheetNotFoundException() );
        }

        return sheet;
    }

    private async getAllUserVacationsByCurrentAnnualEmployeeSheet(annualEmployeeSheet: AnnualEmployeeSheet): Promise<Result<Vacation[]>> {
        const vacations = await this.vacationRepository.findAll( { annualEmployeeSheetId: annualEmployeeSheet.id } );

        if( vacations.isFailed ) {
            throw new Exception( vacations.errors );
        }

        if( vacations.isNotFound ) {
            return Success( [] );
        }

        return vacations;
    }

    private validateVacationRequest(vacation: Vacation, otherVacations: Vacation[]): Result<any> {
        const overlappingDates = otherVacations
            .filter( v => v.status.isPending() || v.status.isApproved() )
            .some( v => v.dateInterval.overlaps( vacation.dateInterval ) );

        if( overlappingDates ) {
            return Failed( new OverlappingVacationDatesException() );
        }

        return Success();
    }

    private calculateTotalWorkingDays(command: CreateVacationRequestCommand, workDayHolidays: Holiday[]): Result<PositiveNumber> {
        const { payload: { fromDate, toDate } } = command.data;
        const dateInterval = DateClosedInterval.create( fromDate, toDate, 'fromDate', 'toDate', true );

        if( dateInterval.isFailed ) {
            return Failed( ...dateInterval.errors );
        }

        const legalPaidDays = sumBy( workDayHolidays,
                                     holiday => dateInterval.value!.includes( holiday.date )
                                                ? 1
                                                : 0 );

        return dateInterval.value!.businessDays( true )
                                  .minus( legalPaidDays );
    }

    private async getAllWorkDayHolidays(): Promise<Result<Holiday[]>> {
        const holidays = await this.holidayRepository.findAllWithWorkDays();

        if( holidays.isFailed ) {
            throw new Exception( holidays.errors );
        }

        if( holidays.isNotFound ) {
            return Success( [] );
        }

        return holidays;
    }

    private async saveVacationToDb(vacation: Vacation, entityManager: EntityManager): Promise<Vacation> {
        const savedVacation = await this.vacationRepository.save( vacation, entityManager );

        if( savedVacation.isFailed ) {
            throw new Exception( savedVacation.errors );
        }

        return savedVacation.value!;
    }

    private async saveAnnualEmployeeSheetToDb(sheet: AnnualEmployeeSheet, entityManager: EntityManager): Promise<AnnualEmployeeSheet> {
        const savedSheet = await this.annualEmployeeSheetRepository.save( sheet, entityManager );

        if( savedSheet.isFailed ) {
            throw new Exception( savedSheet.errors );
        }

        return savedSheet.value!;
    }
}
