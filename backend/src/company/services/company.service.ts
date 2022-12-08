import { CreateCompanyPositionCommand } from '@company/commands/impl/create-company-position.command';
import { CreateCompanyPricingProfileCommand } from '@company/commands/impl/create-company-pricing-profile.command';
import { CompanyPositionDto } from '@company/dtos/company-position.dto';
import { CompanyPricingProfileDto } from '@company/dtos/company-pricing-profile.dto';
import { CompanyDto } from '@company/dtos/company.dto';
import { CreateCompanyPositionDto } from '@company/dtos/create-company-position.dto';
import { CreateCompanyPricingProfileDto } from '@company/dtos/create-company-pricing-profile.dto';
import { modelToCompanyPositionDto } from '@company/mappers/company-position.mappers';
import { modelToCompanyPricingProfileDto } from '@company/mappers/company-pricing-profile.mappers';
import { modelToCompanyDto } from '@company/mappers/company.mappers';
import { Company } from '@company/models/company';
import { CompanyPosition } from '@company/models/company-position';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { GetCompanyQuery } from '@company/queries/impl/get-company.query';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

@Injectable()
export class CompanyService {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) {
    }

    async getCompany(context: AuthenticatedContext): Promise<CompanyDto> {
        const query = new GetCompanyQuery( { context, params: null } );
        const result: Result<Company> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToCompanyDto( result.value! );
    }

    async createCompanyPosition(context: AuthenticatedContext, data: CreateCompanyPositionDto): Promise<CompanyPositionDto> {
        const validation = ValidationChain.validate<typeof data>()
                                          .isNotEmpty( data.name, 'name' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateCompanyPositionCommand( { context, payload: data } );
        const result: Result<CompanyPosition> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToCompanyPositionDto( result.value! );
    }

    async createCompanyPricingProfile(context: AuthenticatedContext, data: CreateCompanyPricingProfileDto): Promise<CompanyPricingProfileDto> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( data.name, 'name' )
                                          .isNotEmpty( data.hourlyRate.amount, 'hourlyRate.amount' )
                                          .isNotEmpty( data.hourlyRate.currency, 'hourlyRate.currency' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateCompanyPricingProfileCommand( { context, payload: data } );
        const result: Result<CompanyPricingProfile> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToCompanyPricingProfileDto( result.value! );
    }
}
