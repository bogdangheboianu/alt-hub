import { AddPositionToCompanyCommand } from '@company/commands/impl/position/add-position-to-company.command';
import { CompanyDto } from '@company/dtos/company.dto';
import { CreateCompanyPositionDto } from '@company/dtos/create-company-position.dto';
import { modelToCompanyDto } from '@company/mappers/company.mappers';
import { Company } from '@company/models/company/company';
import { GetCompanyQuery } from '@company/queries/impl/company/get-company.query';
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

    async addPositionToCompany(context: AuthenticatedContext, data: CreateCompanyPositionDto): Promise<CompanyDto> {
        const validation = ValidationChain.validate<typeof data>()
                                          .isNotEmpty( data.name, 'name' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new AddPositionToCompanyCommand( { context, payload: data } );
        const result: Result<Company> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToCompanyDto( result.value! );
    }
}
