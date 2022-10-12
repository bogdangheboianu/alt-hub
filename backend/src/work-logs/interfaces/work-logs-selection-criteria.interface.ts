import { ProjectId } from '@projects/models/project-id';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { UserId } from '@users/models/user-id';

export interface IWorkLogsSelectionCriteria {
    fromDate?: MandatoryDate;
    toDate?: MandatoryDate;
    userId?: UserId;
    projectId?: ProjectId;
}
