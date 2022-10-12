import { PaginatedResultDto } from '@shared/dtos/paginated-result.dto';
import { WorkLogDto } from '@work-logs/dtos/work-log.dto';

export class PaginatedWorkLogsDto extends PaginatedResultDto {
    data!: WorkLogDto[];
}
