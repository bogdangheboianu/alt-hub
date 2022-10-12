import { ProjectStatusGroupEnum } from '@projects/enums/project-status-group.enum';

export class GetAllProjectsParamsDto {
    statusGroup?: ProjectStatusGroupEnum;
}
