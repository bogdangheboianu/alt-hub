import { ProjectStatusEnum } from '@dtos/project-status.enum';

export class ProjectTimelineDto {
    startDate!: Date | null;
    endDate!: Date | null;
    deadline!: Date | null;
    status!: ProjectStatusEnum;
}
