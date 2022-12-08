import { CreateCompanyPositionCommand } from '@company/commands/impl/create-company-position.command';
import { CompanyPositionCreatedEvent } from '@company/events/impl/company-position-created.event';
import { FailedToCreateCompanyPositionEvent } from '@company/events/impl/failed-to-create-company-position.event';
import { CompanyNotDefinedException } from '@company/exceptions/company.exceptions';
import { Company } from '@company/models/company';
import { CompanyPosition } from '@company/models/company-position';
import { CompanyRepository } from '@company/repositories/company.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( CreateCompanyPositionCommand )
export class CreateCompanyPositionHandler extends BaseSyncCommandHandler<CreateCompanyPositionCommand, CompanyPosition> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly companyRepository: CompanyRepository
    ) {
        super();
    }

    async execute(command: CreateCompanyPositionCommand): Promise<Result<CompanyPosition>> {
        const company = await this.getCompany();

        if( company.isFailed ) {
            return this.failed( command, ...company.errors );
        }

        const updatedCompany = company.value!.addPosition( command );

        if( updatedCompany.isFailed ) {
            return this.failed( command, ...updatedCompany.errors );
        }

        const savedCompany = await this.saveCompanyToDb( updatedCompany.value! );
        const companyPosition = savedCompany.getLastCreatedPosition()!;

        return this.successful( command, companyPosition );
    }

    protected failed(command: CreateCompanyPositionCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateCompanyPositionEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: CreateCompanyPositionCommand, companyPosition: CompanyPosition): Result<CompanyPosition> {
        const { context } = command.data;
        const event = new CompanyPositionCreatedEvent( { context, payload: companyPosition } );

        this.eventBus.publish( event );

        return Success( companyPosition );
    }

    private async getCompany(): Promise<Result<Company>> {
        const company = await this.companyRepository.get();

        if( company.isFailed ) {
            throw new Exception( company.errors );
        }

        if( company.isNotFound ) {
            return Failed( new CompanyNotDefinedException() );
        }

        return company;
    }

    private async saveCompanyToDb(company: Company): Promise<Company> {
        const savedCompany = await this.companyRepository.save( company );

        if( savedCompany.isFailed ) {
            throw new Exception( savedCompany.errors );
        }

        return savedCompany.value!;
    }
}
