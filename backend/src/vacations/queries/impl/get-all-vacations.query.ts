import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { GetAllVacationsParamsDto } from '@vacations/dtos/get-all-vacations-params.dto';

type QueryParams = GetAllVacationsParamsDto;
type QueryData = { context: AuthenticatedContext; params: QueryParams };

export class GetAllVacationsQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetAllVacationsQuery.name;
    }
}
