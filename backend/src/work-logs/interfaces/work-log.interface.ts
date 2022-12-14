import { Project } from '@projects/models/project';
import { ProjectName } from '@projects/models/project-name';
import { Audit } from '@shared/models/audit/audit';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { FullName } from '@users/models/full-name';
import { User } from '@users/models/user';
import { OptionalWorkLogDescription } from '@work-logs/models/optional-work-log-description';
import { WorkLogId } from '@work-logs/models/work-log-id';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';

export interface IWorkLog {
    id?: WorkLogId;
    description?: OptionalWorkLogDescription;
    minutesLogged: PositiveNumber;
    date: MandatoryDate;
    user: User | null;
    userFullName: FullName;
    project: Project | null;
    projectName: ProjectName;
    recurrence?: WorkLogRecurrence | null;
    audit?: Audit;
}
