import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type QueryParams = {}
type QueryData = { context: AuthenticatedContext, params: QueryParams };

export class GetCurrentFiscalYearQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetCurrentFiscalYearQuery.name;
    }
}
