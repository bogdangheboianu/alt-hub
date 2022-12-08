import { AnnualEmployeeSheetNotFoundException } from '@fiscal/exceptions/annual-employee-sheet.exceptions';
import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { AnnualEmployeeSheetRepository } from '@fiscal/repositories/annual-employee-sheet.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { CancelVacationRequestCommand } from '@vacations/commands/impl/cancel-vacation-request.command';
import { FailedToCancelVacationRequestEvent } from '@vacations/events/impl/failed-to-cancel-vacation-request.event';
import { VacationRequestCanceledEvent } from '@vacations/events/impl/vacation-request-canceled.event';
import { VacationNotFoundException } from '@vacations/exceptions/vacation.exceptions';
import { Vacation } from '@vacations/models/vacation';
import { VacationId } from '@vacations/models/vacation-id';
import { VacationRepository } from '@vacations/repositories/vacation.repository';
import { DataSource, EntityManager } from 'typeorm';

@CommandHandler( CancelVacationRequestCommand )
export class CancelVacationRequestHandler extends BaseSyncCommandHandler<CancelVacationRequestCommand, Vacation> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly annualEmployeeSheetRepository: AnnualEmployeeSheetRepository,
        private readonly vacationRepository: VacationRepository,
        private readonly dataSource: DataSource
    ) {
        super();
    }

    async execute(command: CancelVacationRequestCommand): Promise<Result<Vacation>> {
        const annualEmployeeSheetResult = await this.getCurrentAnnualEmployeeSheet( command );

        if( annualEmployeeSheetResult.isFailed ) {
            return this.failed( command, ...annualEmployeeSheetResult.errors );
        }

        const annualEmployeeSheet = annualEmployeeSheetResult.value!;
        const vacationResult = await this.getFutureVacationByIdAndCurrentAnnualEmployeeSheet( command, annualEmployeeSheet );

        if( vacationResult.isFailed ) {
            return this.failed( command, ...vacationResult.errors );
        }

        const vacation = vacationResult.value!;
        const updatedVacationResult = vacation.cancel( command );

        if( updatedVacationResult.isFailed ) {
            return this.failed( command, ...updatedVacationResult.errors );
        }

        const updatedVacation = updatedVacationResult.value!;
        let updatedAnnualEmployeeSheet: Result<AnnualEmployeeSheet>;

        if( updatedVacation.isPaid() ) {
            const workingDaysToAdd = -(
                updatedVacation.workingDays.getValue()
            );
            updatedAnnualEmployeeSheet = annualEmployeeSheet.updateRemainingPaidLeaveDays( command, updatedVacation, workingDaysToAdd );

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

    protected successful(command: CancelVacationRequestCommand, vacation: Vacation): Result<Vacation> {
        const { context } = command.data;
        const event = new VacationRequestCanceledEvent( { context, payload: vacation } );

        this.eventBus.publish( event );

        return Success( vacation );
    }

    protected failed(command: CancelVacationRequestCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCancelVacationRequestEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getCurrentAnnualEmployeeSheet(command: CancelVacationRequestCommand): Promise<Result<AnnualEmployeeSheet>> {
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

    private async getFutureVacationByIdAndCurrentAnnualEmployeeSheet(command: CancelVacationRequestCommand, annualEmployeeSheet: AnnualEmployeeSheet): Promise<Result<Vacation>> {
        const { payload: { vacationId: id } } = command.data;
        const vacationId = VacationId.create( id, 'vacationId' );

        if( vacationId.isFailed ) {
            return Failed( ...vacationId.errors );
        }

        const vacation = await this.vacationRepository.findByIdAndAnnualEmployeeSheetId( vacationId.value!, annualEmployeeSheet.id );

        if( vacation.isFailed ) {
            throw new Exception( vacation.errors );
        }

        if( vacation.isNotFound || !vacation.value!.dateInterval.isInTheFuture() ) {
            return Failed( new VacationNotFoundException() );
        }

        return vacation;
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
