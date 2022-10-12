import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { PaginatedResult } from '@shared/models/generics/paginated-result';
import { Result } from '@shared/models/generics/result';
import { buildWorkLogsSelectionCriteria } from '@work-logs/functions/build-work-logs-selection-criteria.function';
import { WorkLog } from '@work-logs/models/work-log';
import { GetPaginatedWorkLogsQuery } from '@work-logs/queries/impl/get-paginated-work-logs.query';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';

@QueryHandler( GetPaginatedWorkLogsQuery )
export class GetPaginatedWorkLogsHandler extends BaseQueryHandler<GetPaginatedWorkLogsQuery, PaginatedResult<WorkLog>> {
    constructor(
        private readonly workLogRepository: WorkLogRepository
    ) {
        super();
    }

    async execute(query: GetPaginatedWorkLogsQuery): Promise<Result<PaginatedResult<WorkLog>>> {
        const paginatedWorkLogs = await this.getPaginatedWorkLogs( query );

        if( paginatedWorkLogs.isFailed ) {
            return this.failed( query, ...paginatedWorkLogs.errors );
        }

        return this.successful( query, paginatedWorkLogs.value! );
    }

    protected successful(query: GetPaginatedWorkLogsQuery, paginatedWorkLogs: PaginatedResult<WorkLog>): Result<PaginatedResult<WorkLog>> {
        return Success( paginatedWorkLogs );
    }

    protected failed(query: GetPaginatedWorkLogsQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    private async getPaginatedWorkLogs(query: GetPaginatedWorkLogsQuery): Promise<Result<PaginatedResult<WorkLog>>> {
        const { params, context: { user } } = query.data;
        const { pageNumber, itemsPerPage } = params;
        const selectionCriteria = buildWorkLogsSelectionCriteria( params, user );

        if( selectionCriteria.isFailed ) {
            return Failed( ...selectionCriteria.errors );
        }

        const paginatedWorkLogs = await this.workLogRepository.findAllPaginated( selectionCriteria.value!, pageNumber, itemsPerPage );

        if( paginatedWorkLogs.isFailed ) {
            throw new Exception( paginatedWorkLogs.errors );
        }

        return paginatedWorkLogs;
    }
}
