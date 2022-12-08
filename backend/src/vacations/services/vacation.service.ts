import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { CancelVacationRequestCommand } from '@vacations/commands/impl/cancel-vacation-request.command';
import { CreateVacationRequestCommand } from '@vacations/commands/impl/create-vacation-request.command';
import { UpdateVacationRequestCommand } from '@vacations/commands/impl/update-vacation-request.command';
import { CreateVacationRequestDto } from '@vacations/dtos/create-vacation-request.dto';
import { GetAllVacationsParamsDto } from '@vacations/dtos/get-all-vacations-params.dto';
import { UpdateVacationRequestDto } from '@vacations/dtos/update-vacation-request.dto';
import { VacationDto } from '@vacations/dtos/vacation.dto';
import { VacationTypeEnum } from '@vacations/enums/vacation-type.enum';
import { modelsToVacationDtoList, modelToVacationDto } from '@vacations/mappers/vacation.mappers';
import { Vacation } from '@vacations/models/vacation';
import { GetAllVacationsQuery } from '@vacations/queries/impl/get-all-vacations.query';

@Injectable()
export class VacationService {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus
    ) {
    }

    async createVacationRequest(context: AuthenticatedContext, payload: CreateVacationRequestDto): Promise<VacationDto> {
        const validation = ValidationChain.validate<typeof payload>()
                                          .isEnum( payload.type, VacationTypeEnum, 'type' )
                                          .isNotEmpty( payload.fromDate, 'fromDate' )
                                          .isNotEmpty( payload.toDate, 'toDate' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateVacationRequestCommand( { context, payload } );
        const result: Result<Vacation> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToVacationDto( result.value! );
    }

    async updateVacationRequest(context: AuthenticatedContext, vacationId: string, payload: UpdateVacationRequestDto): Promise<VacationDto> {
        const validation = ValidationChain.validate<typeof payload & { vacationId: string }>()
                                          .isNotEmpty( payload.fromDate, 'fromDate' )
                                          .isNotEmpty( payload.toDate, 'toDate' )
                                          .isUUIDv4( vacationId, 'vacationId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateVacationRequestCommand( { context, payload: { ...payload, vacationId } } );
        const result: Result<Vacation> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToVacationDto( result.value! );
    }

    async cancelVacationRequest(context: AuthenticatedContext, vacationId: string): Promise<VacationDto> {
        const validation = ValidationChain.validate<{ vacationId: string }>()
                                          .isUUIDv4( vacationId, 'vacationId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CancelVacationRequestCommand( { context, payload: { vacationId } } );
        const result: Result<Vacation> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToVacationDto( result.value! );
    }

    async getAllVacations(context: AuthenticatedContext, params: GetAllVacationsParamsDto): Promise<VacationDto[]> {
        const validation = ValidationChain.validate<typeof params>()
                                          .isUUIDv4( params.fiscalYearId, 'fiscalYearId', true )
                                          .isUUIDv4( params.annualEmployeeSheetId, 'annualEmployeeSheetId', true )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetAllVacationsQuery( { context, params } );
        const result: Result<Vacation[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToVacationDtoList( result.value! );
    }
}
