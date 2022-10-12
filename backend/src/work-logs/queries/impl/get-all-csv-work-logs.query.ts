import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { GetAllCsvWorkLogsParamsDto } from '@work-logs/dtos/get-all-csv-work-logs-params.dto';

type QueryParams = GetAllCsvWorkLogsParamsDto;
type QueryData = { context: AuthenticatedContext; params: QueryParams };

export class GetAllCsvWorkLogsQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetAllCsvWorkLogsQuery.name;
    }
}
