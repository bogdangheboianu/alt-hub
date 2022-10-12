import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type QueryParams = { id: string }
type QueryData = { context: AuthenticatedContext, params: QueryParams };

export class GetProjectByIdQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetProjectByIdQuery.name;
    }
}
