import { PaginationParamsDto } from '@shared/dtos/pagination-params.dto';

export class GetPaginatedWorkLogsParamsDto extends PaginationParamsDto {
    fromDate?: Date;
    toDate?: Date;
    userId?: string;
    projectId?: string;
}
