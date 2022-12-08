import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type QueryData = { context: AuthenticatedContext; params: null };

export class GetAllCompanyPositionsQuery implements IDomainQuery<null> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetAllCompanyPositionsQuery.name;
    }
}
