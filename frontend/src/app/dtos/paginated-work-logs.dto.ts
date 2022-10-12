import { PaginatedResultDto } from '@dtos/paginated-result.dto';
import { WorkLogDto } from '@dtos/work-log.dto';

export class PaginatedWorkLogsDto extends PaginatedResultDto {
    data!: WorkLogDto[];
}
