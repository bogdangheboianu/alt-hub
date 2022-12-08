import { CreateAnnualEmployeeSheetCommand } from '@fiscal/commands/impl/create-annual-employee-sheet.command';
import { UpdateAnnualEmployeeSheetCommand } from '@fiscal/commands/impl/update-annual-employee-sheet.command';
import { AnnualEmployeeSheetDto } from '@fiscal/dtos/annual-employee-sheet.dto';
import { CreateAnnualEmployeeSheetDto } from '@fiscal/dtos/create-annual-employee-sheet.dto';
import { FiscalYearDto } from '@fiscal/dtos/fiscal-year.dto';
import { GetCurrentAnnualEmployeeSheetParamsDto } from '@fiscal/dtos/get-current-annual-employee-sheet-params.dto';
import { UpdateAnnualEmployeeSheetDto } from '@fiscal/dtos/update-annual-employee-sheet.dto';
import { modelToAnnualEmployeeSheetDto, modelToFiscalYearDto } from '@fiscal/mappers/fiscal-year.mappers';
import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { FiscalYear } from '@fiscal/models/fiscal-year';
import { GetCurrentAnnualEmployeeSheetQuery } from '@fiscal/queries/impl/get-current-annual-employee-sheet.query';
import { GetCurrentFiscalYearQuery } from '@fiscal/queries/impl/get-current-fiscal-year.query';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

@Injectable()
export class FiscalService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {
    }

    async createAnnualEmployeeSheet(context: AuthenticatedContext, payload: CreateAnnualEmployeeSheetDto): Promise<FiscalYearDto> {
        const validation = ValidationChain.validate<typeof payload>()
                                          .isUUIDv4( payload.userId, 'userId' )
                                          .isNotEmpty( payload.paidLeaveDays, 'paidLeaveDays' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateAnnualEmployeeSheetCommand( { context, payload } );
        const result: Result<FiscalYear> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToFiscalYearDto( result.value! );
    }

    async updateAnnualEmployeeSheet(context: AuthenticatedContext, annualEmployeeSheetId: string, payload: UpdateAnnualEmployeeSheetDto): Promise<FiscalYearDto> {
        const validation = ValidationChain.validate<typeof payload & { annualEmployeeSheetId: string }>()
                                          .isUUIDv4( annualEmployeeSheetId, 'annualEmployeeSheetId' )
                                          .isNotEmpty( payload.paidLeaveDays, 'paidLeaveDays' )
                                          .isNotEmpty( payload.remainingPaidLeaveDays, 'remainingPaidLeaveDays' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateAnnualEmployeeSheetCommand( { context, payload: { ...payload, annualEmployeeSheetId } } );
        const result: Result<FiscalYear> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToFiscalYearDto( result.value! );
    }

    async getCurrentFiscalYear(context: AuthenticatedContext): Promise<FiscalYearDto> {
        const query = new GetCurrentFiscalYearQuery( { context, params: {} } );
        const result: Result<FiscalYear> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToFiscalYearDto( result.value! );
    }

    async getCurrentAnnualEmployeeSheet(context: AuthenticatedContext, params: GetCurrentAnnualEmployeeSheetParamsDto): Promise<AnnualEmployeeSheetDto> {
        const { user: authenticatedUser } = context;

        if( authenticatedUser.id.getValue() !== params.userId.trim() && !authenticatedUser.account.isAdmin ) {
            throw new ForbiddenException();
        }

        const validation = ValidationChain.validate<typeof params>()
                                          .isUUIDv4( params.userId, 'userId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetCurrentAnnualEmployeeSheetQuery( { context, params } );
        const result: Result<AnnualEmployeeSheet> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToAnnualEmployeeSheetDto( result.value! );
    }
}
