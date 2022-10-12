import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { GetAllUsersParamsDto } from '@users/dtos/get-all-users-params.dto';

type QueryParams = GetAllUsersParamsDto;
type QueryData = { context: AuthenticatedContext; params: QueryParams };

export class GetAllUsersQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetAllUsersQuery.name;
    }
}
