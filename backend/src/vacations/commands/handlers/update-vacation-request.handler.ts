import { AnnualEmployeeSheetNotFoundException } from '@fiscal/exceptions/annual-employee-sheet.exceptions';
import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { AnnualEmployeeSheetRepository } from '@fiscal/repositories/annual-employee-sheet.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { DateClosedInterval } from '@shared/models/date/date-closed-interval';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { UpdateVacationRequestCommand } from '@vacations/commands/impl/update-vacation-request.command';
import { FailedToUpdateVacationRequestEvent } from '@vacations/events/impl/failed-to-update-vacation-request.event';
import { VacationRequestUpdatedEvent } from '@vacations/events/impl/vacation-request-updated.event';
import { OverlappingVacationDatesException, VacationNotFoundException } from '@vacations/exceptions/vacation.exceptions';
import { Holiday } from '@vacations/models/holiday';
import { Vacation } from '@vacations/models/vacation';
import { VacationId } from '@vacations/models/vacation-id';
import { HolidayRepository } from '@vacations/repositories/holiday.repository';
import { VacationRepository } from '@vacations/repositories/vacation.repository';
import { sumBy } from 'lodash';
import { DataSource, EntityManager } from 'typeorm';

@CommandHandler( UpdateVacationRequestCommand )
export class UpdateVacationRequestHandler extends BaseSyncCommandHandler<UpdateVacationRequestCommand, Vacation> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly annualEmployeeSheetRepository: AnnualEmployeeSheetRepository,
        private readonly vacationRepository: VacationRepository,
        private readonly holidayRepository: HolidayRepository,
        private readonly dataSource: DataSource
    ) {
        super();
    }

    async execute(command: UpdateVacationRequestCommand): Promise<Result<Vacation>> {
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
        const allUserVacationsResult = await this.getAllUserVacationsByCurrentAnnualEmployeeSheet( annualEmployeeSheet );

        if( allUserVacationsResult.isFailed ) {
            return this.failed( command, ...allUserVacationsResult.errors );
        }

        const allUserVacations = allUserVacationsResult.value!;
        const vacationResult = this.getFutureVacationById( command, allUserVacations );

        if( vacationResult.isFailed ) {
            return this.failed( command, ...vacationResult.errors );
        }

        const vacation = vacationResult.value!;
        const workingDays = this.calculateTotalWorkingDays( command, workDayHolidays );

        if( workingDays.isFailed ) {
            return this.failed( command, ...workingDays.errors );
        }

        const updatedVacationResult = vacation.update( command, workingDays.value! );

        if( updatedVacationResult.isFailed ) {
            return this.failed( command, ...updatedVacationResult.errors );
        }

        const updatedVacation = updatedVacationResult.value!;
        const updateVacationRequestValidation = this.validateUpdateVacationRequest( updatedVacation, allUserVacations );

        if( updateVacationRequestValidation.isFailed ) {
            return this.failed( command, ...updateVacationRequestValidation.errors );
        }

        let updatedAnnualEmployeeSheet: Result<AnnualEmployeeSheet>;

        if( updatedVacation.isPaid() ) {
            const workingDaysDifference = updatedVacation.workingDays.getValue() - vacation.workingDays.getValue();
            updatedAnnualEmployeeSheet = annualEmployeeSheet.updateRemainingPaidLeaveDays( command, updatedVacation, workingDaysDifference );

            if( updatedAnnualEmployeeSheet.isFailed ) {
                return this.failed( command, ...updatedAnnualEmployeeSheet.errors );
            }
        }

        return await this.dataSource.transaction( async (entityManager: EntityManager) => {
            const savedVacation = await this.saveVacationToDb( updatedVacation, entityManager );

            if( savedVacation.isPaid() ) {
                await this.saveAnnualEmployeeSheetToDb( updatedAnnualEmployeeSheet!.value!, entityManager );
            }

            return this.successful( command, savedVacation );
        } );
    }

    protected successful(command: UpdateVacationRequestCommand, vacation: Vacation): Result<Vacation> {
        const { context } = command.data;
        const event = new VacationRequestUpdatedEvent( { context, payload: vacation } );

        this.eventBus.publish( event );

        return Success( vacation );
    }

    protected failed(command: UpdateVacationRequestCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToUpdateVacationRequestEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getCurrentAnnualEmployeeSheet(command: UpdateVacationRequestCommand): Promise<Result<AnnualEmployeeSheet>> {
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

    private getFutureVacationById(command: UpdateVacationRequestCommand, vacations: Vacation[]): Result<Vacation> {
        const { payload: { vacationId: id } } = command.data;
        const vacationId = VacationId.create( id, 'vacationId' );

        if( vacationId.isFailed ) {
            return Failed( ...vacationId.errors );
        }

        const vacation = vacations.find( v => v.id.equals( vacationId.value! ) && v.dateInterval.isInTheFuture() );

        return valueIsEmpty( vacation )
               ? Failed( new VacationNotFoundException() )
               : Success( vacation );
    }

    private validateUpdateVacationRequest(vacation: Vacation, otherVacations: Vacation[]): Result<any> {
        const overlappingDates = otherVacations
            .filter( v => !v.id.equals( vacation.id ) && (
                v.status.isPending() || v.status.isApproved()
            ) )
            .some( v => v.dateInterval.overlaps( vacation.dateInterval ) );

        if( overlappingDates ) {
            return Failed( new OverlappingVacationDatesException() );
        }

        return Success();
    }

    private calculateTotalWorkingDays(command: UpdateVacationRequestCommand, workDayHolidays: Holiday[]): Result<PositiveNumber> {
        const { payload: { fromDate, toDate } } = command.data;
        const dateInterval = DateClosedInterval.create( fromDate, toDate, 'fromDate', 'toDate' );

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
