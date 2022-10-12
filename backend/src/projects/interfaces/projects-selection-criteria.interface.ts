import { ProjectStatusGroup } from '@projects/models/project-status-group';
import { UserId } from '@users/models/user-id';

export interface IProjectsSelectionCriteria {
    statusGroup?: ProjectStatusGroup;
    userId?: UserId;
}
