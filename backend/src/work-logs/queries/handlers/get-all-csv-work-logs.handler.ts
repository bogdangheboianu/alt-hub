import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';
import { buildWorkLogsSelectionCriteria } from '@work-logs/functions/build-work-logs-selection-criteria.function';
import { CsvWorkLog } from '@work-logs/models/csv-work-log';
import { WorkLog } from '@work-logs/models/work-log';
import { GetAllCsvWorkLogsQuery } from '@work-logs/queries/impl/get-all-csv-work-logs.query';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';

@QueryHandler( GetAllCsvWorkLogsQuery )
export class GetAllCsvWorkLogsHandler extends BaseQueryHandler<GetAllCsvWorkLogsQuery, CsvWorkLog[]> {
    constructor(
        private readonly workLogRepository: WorkLogRepository
    ) {
        super();
    }

    async execute(query: GetAllCsvWorkLogsQuery): Promise<Result<CsvWorkLog[]>> {
        const workLogs = await this.getAllWorkLogs( query );

        if( workLogs.isFailed ) {
            return this.failed( query, ...workLogs.errors );
        }

        const csvWorkLogs = workLogs.value!.map( wl => wl.toCsvWorkLog() );

        return this.successful( query, csvWorkLogs );
    }

    protected successful(query: GetAllCsvWorkLogsQuery, csvWorkLogs: CsvWorkLog[]): Result<CsvWorkLog[]> {
        return Success( csvWorkLogs );
    }

    protected failed(query: GetAllCsvWorkLogsQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    private async getAllWorkLogs(query: GetAllCsvWorkLogsQuery): Promise<Result<WorkLog[]>> {
        const { params, context: { user } } = query.data;
        const selectionCriteria = buildWorkLogsSelectionCriteria( params, user );

        if( selectionCriteria.isFailed ) {
            return Failed( ...selectionCriteria.errors );
        }

        const csvWorkLogs = await this.workLogRepository.findAll( selectionCriteria.value! );

        if( csvWorkLogs.isFailed ) {
            throw new Exception( csvWorkLogs.errors );
        }

        if( csvWorkLogs.isNotFound ) {
            return Success( [] );
        }

        return csvWorkLogs;
    }
}
