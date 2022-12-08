import { CreateCompanyPricingProfileCommand } from '@company/commands/impl/create-company-pricing-profile.command';
import { CompanyPricingProfileCreatedEvent } from '@company/events/impl/company-pricing-profile-created.event';
import { FailedToCreateCompanyPricingProfileEvent } from '@company/events/impl/failed-to-create-company-pricing-profile.event';
import { CompanyNotDefinedException } from '@company/exceptions/company.exceptions';
import { Company } from '@company/models/company';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { CompanyRepository } from '@company/repositories/company.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( CreateCompanyPricingProfileCommand )
export class CreateCompanyPricingProfileHandler extends BaseSyncCommandHandler<CreateCompanyPricingProfileCommand, CompanyPricingProfile> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly companyRepository: CompanyRepository
    ) {
        super();
    }

    async execute(command: CreateCompanyPricingProfileCommand): Promise<Result<CompanyPricingProfile>> {
        const company = await this.getCompany();

        if( company.isFailed ) {
            return this.failed( command, ...company.errors );
        }

        const updatedCompany = company.value!.addPricingProfile( command );

        if( updatedCompany.isFailed ) {
            return this.failed( command, ...updatedCompany.errors );
        }

        const savedCompany = await this.saveCompanyToDb( updatedCompany.value! );
        const companyPricingProfile = savedCompany.getLastCreatedPricingProfile()!;

        return this.successful( command, companyPricingProfile );
    }

    protected failed(command: CreateCompanyPricingProfileCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateCompanyPricingProfileEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: CreateCompanyPricingProfileCommand, companyPricingProfile: CompanyPricingProfile): Result<CompanyPricingProfile> {
        const { context } = command.data;
        const event = new CompanyPricingProfileCreatedEvent( { context, payload: companyPricingProfile } );

        this.eventBus.publish( event );

        return Success( companyPricingProfile );
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
