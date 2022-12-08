import { GetCurrentAnnualEmployeeSheetParamsDto } from '@fiscal/dtos/get-current-annual-employee-sheet-params.dto';
import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type QueryParams = GetCurrentAnnualEmployeeSheetParamsDto
type QueryData = { context: AuthenticatedContext, params: QueryParams };

export class GetCurrentAnnualEmployeeSheetQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetCurrentAnnualEmployeeSheetQuery.name;
    }
}
