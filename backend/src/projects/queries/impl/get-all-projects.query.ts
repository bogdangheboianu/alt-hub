import { GetAllProjectsParamsDto } from '@projects/dtos/get-all-projects-params.dto';
import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type QueryParams = GetAllProjectsParamsDto
type QueryData = { context: AuthenticatedContext, params: QueryParams };

export class GetAllProjectsQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetAllProjectsQuery.name;
    }
}
