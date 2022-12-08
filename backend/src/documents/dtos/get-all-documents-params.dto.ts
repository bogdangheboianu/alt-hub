import { arrayQueryParamTransform } from '@shared/functions/array-query-param-transform.function';
import { Transform } from 'class-transformer';

export class GetAllDocumentsParamsDto {
    @Transform( arrayQueryParamTransform )
    companiesIds?: string[];
    @Transform( arrayQueryParamTransform )
    usersIds?: string[];
    @Transform( arrayQueryParamTransform )
    clientsIds?: string[];
}
