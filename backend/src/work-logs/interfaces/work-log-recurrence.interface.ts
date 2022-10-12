import { Project } from '@projects/models/project';
import { Audit } from '@shared/models/audit/audit';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { User } from '@users/models/user';
import { WeekDay } from '@work-logs/models/week-day';
import { WorkLogRecurrenceId } from '@work-logs/models/work-log-recurrence-id';

export interface IWorkLogRecurrence {
    id?: WorkLogRecurrenceId;
    minutesLogged: PositiveNumber;
    user: User;
    project: Project;
    weekDays: WeekDay[];
    active: boolean;
    audit?: Audit;
}
