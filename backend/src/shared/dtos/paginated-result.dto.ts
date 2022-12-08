import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class PaginatedResultDto {
    totalRecords!: number;
    totalPages!: number;
    hasNext!: boolean;
    hasPrevious!: boolean;
}
