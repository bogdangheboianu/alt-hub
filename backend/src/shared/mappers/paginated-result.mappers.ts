import { PaginatedResultDto } from '@shared/dtos/paginated-result.dto';
import { PaginatedResult } from '@shared/models/generics/paginated-result';

export const modelToPaginatedResultDto = (model: PaginatedResult<any>): PaginatedResultDto => (
    {
        totalRecords: model.totalRecords,
        totalPages  : model.totalPages,
        hasNext     : model.hasNext,
        hasPrevious : model.hasPrevious
    }
);
