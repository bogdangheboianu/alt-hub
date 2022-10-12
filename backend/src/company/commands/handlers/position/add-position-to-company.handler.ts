import { AddPositionToCompanyCommand } from '@company/commands/impl/position/add-position-to-company.command';
import { FailedToAddPositionToCompanyEvent } from '@company/events/impl/position/failed-to-add-position-to-company.event';
import { PositionAddedToCompanyEvent } from '@company/events/impl/position/position-added-to-company.event';
import { CompanyNotDefinedException } from '@company/exceptions/company.exceptions';
import { Company } from '@company/models/company/company';
import { CompanyPosition } from '@company/models/position/company-position';
import { CompanyRepository } from '@company/repositories/company.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( AddPositionToCompanyCommand )
export class AddPositionToCompanyHandler extends BaseSyncCommandHandler<AddPositionToCompanyCommand, Company> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly companyRepository: CompanyRepository
    ) {
        super();
    }

    async execute(command: AddPositionToCompanyCommand): Promise<Result<Company>> {
        const company = await this.getCompany();

        if( company.isFailed ) {
            return this.failed( command, ...company.errors );
        }

        const updatedCompany = this.addPositionToCompany( command, company.value! );

        if( updatedCompany.isFailed ) {
            return this.failed( command, ...updatedCompany.errors );
        }

        const savedCompany = await this.saveCompanyToDb( updatedCompany.value! );

        return this.successful( command, savedCompany );
    }

    protected failed(command: AddPositionToCompanyCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToAddPositionToCompanyEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: AddPositionToCompanyCommand, company: Company): Result<Company> {
        const { context } = command.data;
        const event = new PositionAddedToCompanyEvent(
            { context, payload: { company, companyPosition: company.getLastCreatedPosition()! } }
        );

        this.eventBus.publish( event );

        return Success( company );
    }

    private async getCompany(): Promise<Result<Company>> {
        const company = await this.companyRepository.getCompany();

        if( company.isFailed ) {
            throw new Exception( company.errors );
        }

        if( company.isNotFound ) {
            return Failed( new CompanyNotDefinedException() );
        }

        return company;
    }

    private addPositionToCompany(command: AddPositionToCompanyCommand, company: Company): Result<Company> {
        const companyPosition = this.createCompanyPosition( command );

        if( companyPosition.isFailed ) {
            return Failed( ...companyPosition.errors );
        }

        return company.addPosition( command, companyPosition.value! );

    }

    private createCompanyPosition(command: AddPositionToCompanyCommand): Result<CompanyPosition> {
        return CompanyPosition.create( command );
    }

    private async saveCompanyToDb(company: Company): Promise<Company> {
        return await this.companyRepository.saveCompany( company );
    }
}
