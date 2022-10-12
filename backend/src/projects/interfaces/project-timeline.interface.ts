import { ProjectStatus } from '@projects/models/project-status';
import { DateOpenInterval } from '@shared/models/date/date-open-interval';
import { OptionalDate } from '@shared/models/date/optional-date';

export interface IProjectTimeline {
    period: DateOpenInterval;
    deadline: OptionalDate;
    status: ProjectStatus;
}
