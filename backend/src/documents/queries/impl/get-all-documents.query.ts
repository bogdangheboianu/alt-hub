import { GetAllDocumentsParamsDto } from '@documents/dtos/get-all-documents-params.dto';
import { IDomainQuery } from '@shared/interfaces/generics/domain-query.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type QueryParams = GetAllDocumentsParamsDto;
type QueryData = { context: AuthenticatedContext; params: QueryParams };

export class GetAllDocumentsQuery implements IDomainQuery<QueryParams> {
    readonly data: QueryData;
    readonly name: string;

    constructor(data: QueryData) {
        this.data = data;
        this.name = GetAllDocumentsQuery.name;
    }
}
