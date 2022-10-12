import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { GetPaginatedWorkLogsParamsDto } from '@work-logs/dtos/get-paginated-work-logs-params.dto';

type QueryParams = GetPaginatedWorkLogsParamsDto;
type QueryData = { context: AuthenticatedContext; params: QueryParams };

export class GetPaginatedWorkLogsQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetPaginatedWorkLogsQuery.name;
    }
}
