import { UpdateAnnualEmployeeSheetCommand } from '@fiscal/commands/impl/update-annual-employee-sheet.command';
import { AnnualEmployeeSheetUpdatedEvent } from '@fiscal/events/impl/annual-employee-sheet-updated.event';
import { FailedToUpdateAnnualEmployeeSheetEvent } from '@fiscal/events/impl/failed-to-update-annual-employee-sheet.event';
import { FiscalYearNotFoundException } from '@fiscal/exceptions/fiscal-year.exceptions';
import { FiscalYear } from '@fiscal/models/fiscal-year';
import { FiscalYearRepository } from '@fiscal/repositories/fiscal-year.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( UpdateAnnualEmployeeSheetCommand )
export class UpdateAnnualEmployeeSheetHandler extends BaseSyncCommandHandler<UpdateAnnualEmployeeSheetCommand, FiscalYear> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly fiscalYearRepository: FiscalYearRepository
    ) {
        super();
    }

    async execute(command: UpdateAnnualEmployeeSheetCommand): Promise<Result<FiscalYear>> {
        const currentFiscalYear = await this.getCurrentFiscalYear();

        if( currentFiscalYear.isFailed ) {
            return this.failed( command, ...currentFiscalYear.errors );
        }

        const updatedFiscalYear = currentFiscalYear.value!.updateAnnualEmployeeSheet( command );

        if( updatedFiscalYear.isFailed ) {
            return this.failed( command, ...updatedFiscalYear.errors );
        }

        const savedFiscalYear = await this.saveFiscalYearToDb( updatedFiscalYear.value! );

        return this.successful( command, savedFiscalYear );
    }

    protected successful(command: UpdateAnnualEmployeeSheetCommand, fiscalYear: FiscalYear): Result<FiscalYear> {
        const { context } = command.data;
        const event = new AnnualEmployeeSheetUpdatedEvent( { context, payload: fiscalYear } );

        this.eventBus.publish( event );

        return Success( fiscalYear );
    }

    protected failed(command: UpdateAnnualEmployeeSheetCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToUpdateAnnualEmployeeSheetEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getCurrentFiscalYear(): Promise<Result<FiscalYear>> {
        const fiscalYear = await this.fiscalYearRepository.findCurrent();

        if( fiscalYear.isFailed ) {
            throw new Exception( fiscalYear.errors );
        }

        if( fiscalYear.isNotFound ) {
            return Failed( new FiscalYearNotFoundException() );
        }

        return fiscalYear;
    }

    private async saveFiscalYearToDb(fiscalYear: FiscalYear): Promise<FiscalYear> {
        const savedFiscalYear = await this.fiscalYearRepository.save( fiscalYear );

        if( savedFiscalYear.isFailed ) {
            throw new Exception( savedFiscalYear.errors );
        }

        return savedFiscalYear.value!;
    }
}
