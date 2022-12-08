import { ProjectDto } from '@projects/dtos/project.dto';
import { UserDto } from '@users/dtos/user.dto';
import { WorkLogRecurrenceDto } from '@work-logs/dtos/work-log-recurrence.dto';

export class WorkLogDto {
    id!: string;
    minutesLogged!: number;
    date!: Date;
    description!: string | null;
    user!: UserDto | null;
    userFullName!: string;
    project!: ProjectDto | null;
    projectName!: string;
    recurrence!: WorkLogRecurrenceDto | null;
}
