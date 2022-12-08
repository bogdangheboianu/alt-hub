import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class PaginationParamsDto {
    pageNumber?: number;
    itemsPerPage?: number;
}
