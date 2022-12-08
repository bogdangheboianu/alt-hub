import { CreateAnnualEmployeeSheetCommand } from '@fiscal/commands/impl/create-annual-employee-sheet.command';
import { AnnualEmployeeSheetCreatedEvent } from '@fiscal/events/impl/annual-employee-sheet-created.event';
import { FiscalYearNotFoundException } from '@fiscal/exceptions/fiscal-year.exceptions';
import { FiscalYear } from '@fiscal/models/fiscal-year';
import { FiscalYearRepository } from '@fiscal/repositories/fiscal-year.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { FailedToActivateUserEvent } from '@users/events/impl/failed-to-activate-user.event';
import { UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( CreateAnnualEmployeeSheetCommand )
export class CreateAnnualEmployeeSheetHandler extends BaseSyncCommandHandler<CreateAnnualEmployeeSheetCommand, FiscalYear> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly userRepository: UserRepository,
        private readonly fiscalYearRepository: FiscalYearRepository
    ) {
        super();
    }

    async execute(command: CreateAnnualEmployeeSheetCommand): Promise<Result<FiscalYear>> {
        const user = await this.getUserById( command );

        if( user.isFailed ) {
            return this.failed( command, ...user.errors );
        }

        const currentFiscalYear = await this.getCurrentFiscalYear();

        if( currentFiscalYear.isFailed ) {
            return this.failed( command, ...currentFiscalYear.errors );
        }

        const updatedFiscalYear = currentFiscalYear.value!.addAnnualEmployeeSheet( command, user.value! );

        if( updatedFiscalYear.isFailed ) {
            return this.failed( command, ...updatedFiscalYear.errors );
        }

        const savedFiscalYear = await this.saveFiscalYearToDb( updatedFiscalYear.value! );

        return this.successful( command, savedFiscalYear );
    }

    protected successful(command: CreateAnnualEmployeeSheetCommand, fiscalYear: FiscalYear): Result<FiscalYear> {
        const { context } = command.data;
        const event = new AnnualEmployeeSheetCreatedEvent( { context, payload: fiscalYear } );

        this.eventBus.publish( event );

        return Success( fiscalYear );
    }

    protected failed(command: CreateAnnualEmployeeSheetCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToActivateUserEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getUserById(command: CreateAnnualEmployeeSheetCommand): Promise<Result<User>> {
        const { userId: id } = command.data.payload;
        const userId = UserId.create( id );

        if( userId.isFailed ) {
            return Failed( ...userId.errors );
        }

        const user = await this.userRepository.findById( userId.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        return user;
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
