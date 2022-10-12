import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { PaginatedResult } from '@shared/models/generics/paginated-result';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { CreateWorkLogCommand } from '@work-logs/commands/impl/create-work-log.command';
import { UpdateWorkLogCommand } from '@work-logs/commands/impl/update-work-log.command';
import { CreateWorkLogDto } from '@work-logs/dtos/create-work-log.dto';
import { CsvWorkLogDto } from '@work-logs/dtos/csv-work-log.dto';
import { GetAllCsvWorkLogsParamsDto } from '@work-logs/dtos/get-all-csv-work-logs-params.dto';
import { GetPaginatedWorkLogsParamsDto } from '@work-logs/dtos/get-paginated-work-logs-params.dto';
import { PaginatedWorkLogsDto } from '@work-logs/dtos/paginated-work-logs.dto';
import { UpdateWorkLogDto } from '@work-logs/dtos/update-work-log.dto';
import { WorkLogDto } from '@work-logs/dtos/work-log.dto';
import { modelsToCsvWorkLogDtoList } from '@work-logs/mappers/csv-work-log.mappers';
import { modelToPaginatedWorkLogsDto, modelToWorkLogDto } from '@work-logs/mappers/work-log.mappers';
import { CsvWorkLog } from '@work-logs/models/csv-work-log';
import { WorkLog } from '@work-logs/models/work-log';
import { GetAllCsvWorkLogsQuery } from '@work-logs/queries/impl/get-all-csv-work-logs.query';
import { GetPaginatedWorkLogsQuery } from '@work-logs/queries/impl/get-paginated-work-logs.query';

@Injectable()
export class WorkLogService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {
    }

    async createWorkLog(context: AuthenticatedContext, data: CreateWorkLogDto): Promise<WorkLogDto> {
        const validation = ValidationChain.validate<typeof data>()
                                          .isNotEmpty( data.minutesLogged, 'minutesLogged' )
                                          .isNotEmpty( data.date, 'date' )
                                          .isUUIDv4( data.projectId, 'projectId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateWorkLogCommand( { context, payload: data } );
        const result: Result<WorkLog> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToWorkLogDto( result.value! );
    }

    async updateWorkLog(context: AuthenticatedContext, id: string, payload: UpdateWorkLogDto): Promise<WorkLogDto> {
        const validation = ValidationChain.validate<typeof payload & { id: string }>()
                                          .isUUIDv4( id, 'id' )
                                          .isNotEmpty( payload.minutesLogged, 'minutesLogged' )
                                          .isNotEmpty( payload.date, 'date' )
                                          .isUUIDv4( payload.projectId, 'projectId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateWorkLogCommand( { context, payload: { ...payload, id } } );
        const result: Result<WorkLog> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToWorkLogDto( result.value! );
    }

    async getPaginatedWorkLogs(context: AuthenticatedContext, params: GetPaginatedWorkLogsParamsDto): Promise<PaginatedWorkLogsDto> {
        const validation = ValidationChain.validate<typeof params>()
                                          .isEqualOrGreaterThan( params.pageNumber, 0, 'pageNumber', true )
                                          .isEqualOrGreaterThan( params.itemsPerPage, 5, 'itemsPerPage', true )
                                          .isValidDate( params.fromDate, 'fromDate', true )
                                          .isValidDate( params.toDate, 'toDate', true )
                                          .isUUIDv4( params.userId, 'userId', true )
                                          .isUUIDv4( params.projectId, 'projectId', true )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetPaginatedWorkLogsQuery( { context, params } );
        const result: Result<PaginatedResult<WorkLog>> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToPaginatedWorkLogsDto( result.value! );
    }

    async getAllCsvWorkLogs(context: AuthenticatedContext, params: GetAllCsvWorkLogsParamsDto): Promise<CsvWorkLogDto[]> {
        const validation = ValidationChain.validate<typeof params>()
                                          .isValidDate( params.fromDate, 'fromDate', true )
                                          .isValidDate( params.toDate, 'toDate', true )
                                          .isUUIDv4( params.userId, 'userId', true )
                                          .isUUIDv4( params.projectId, 'projectId', true )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetAllCsvWorkLogsQuery( { context, params } );
        const result: Result<CsvWorkLog[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToCsvWorkLogDtoList( result.value! );
    }
}
