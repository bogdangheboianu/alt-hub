import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { GetAllUserWorkLogRecurrencesQuery } from '@work-logs/queries/impl/get-all-user-work-log-recurrences.query';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';

@QueryHandler( GetAllUserWorkLogRecurrencesQuery )
export class GetAllUserWorkLogRecurrencesHandler extends BaseQueryHandler<GetAllUserWorkLogRecurrencesQuery, WorkLogRecurrence[]> {
    constructor(
        private readonly workLogRecurrenceRepository: WorkLogRecurrenceRepository
    ) {
        super();
    }

    async execute(query: GetAllUserWorkLogRecurrencesQuery): Promise<Result<WorkLogRecurrence[]>> {
        const workLogRecurrences = await this.getAllUserWorkLogRecurrences( query );

        if( workLogRecurrences.isFailed ) {
            return this.failed( query, ...workLogRecurrences.errors );
        }

        return this.successful( query, workLogRecurrences.value! );
    }

    protected successful(query: GetAllUserWorkLogRecurrencesQuery, workLogRecurrences: WorkLogRecurrence[]): Result<WorkLogRecurrence[]> {
        return Success( workLogRecurrences );
    }

    protected failed(query: GetAllUserWorkLogRecurrencesQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    private async getAllUserWorkLogRecurrences(query: GetAllUserWorkLogRecurrencesQuery): Promise<Result<WorkLogRecurrence[]>> {
        const recurrences = await this.workLogRecurrenceRepository.findAllByUserId( query.data.context.user.id );

        if( recurrences.isFailed ) {
            throw new Exception( recurrences.errors );
        }

        if( recurrences.isNotFound ) {
            return Success( [] );
        }

        return recurrences;
    }
}
