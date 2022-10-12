import { ProjectStatusGroupEnum } from '@dtos/project-status-group.enum';

export class GetAllProjectsParamsDto {
    statusGroup?: ProjectStatusGroupEnum;
}
