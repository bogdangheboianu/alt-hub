import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type QueryData = { context: AuthenticatedContext; params: null };

export class GetCompanyQuery implements IDomainQuery<null> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetCompanyQuery.name;
    }
}
