import { ProjectStatusGroupEnum } from '@projects/enums/project-status-group.enum';
import { ProjectStatusEnum } from '@projects/enums/project-status.enum';

const ACTIVE_PROJECT_STATUSES = [
    ProjectStatusEnum.Draft,
    ProjectStatusEnum.InProgress,
    ProjectStatusEnum.OnHold,
    ProjectStatusEnum.Maintenance
];

const ONGOING_PROJECT_STATUSES = [
    ProjectStatusEnum.InProgress,
    ProjectStatusEnum.Maintenance
];

const ENDED_PROJECT_STATUSES = [
    ProjectStatusEnum.Canceled,
    ProjectStatusEnum.Completed
];

export const GroupedProjectStatuses: { [key in ProjectStatusGroupEnum]: ProjectStatusEnum[] } = {
    [ProjectStatusGroupEnum.Active] : ACTIVE_PROJECT_STATUSES,
    [ProjectStatusGroupEnum.Ongoing]: ONGOING_PROJECT_STATUSES,
    [ProjectStatusGroupEnum.Ended]  : ENDED_PROJECT_STATUSES
};
