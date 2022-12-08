import { ApiExtraModels } from '@nestjs/swagger';
import { PaginationParamsDto } from '@shared/dtos/pagination-params.dto';

@ApiExtraModels()
export class GetPaginatedWorkLogsParamsDto extends PaginationParamsDto {
    fromDate?: Date;
    toDate?: Date;
    userId?: string;
    projectId?: string;
    clientId?: string;
}
