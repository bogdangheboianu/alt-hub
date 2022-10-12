import { ProjectDto } from '@dtos/project.dto';
import { UserDto } from '@dtos/user.dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence.dto';

export class WorkLogDto {
    id!: string;
    minutesLogged!: number;
    date!: Date;
    description!: string | null;
    user!: UserDto;
    project!: ProjectDto;
    recurrence!: WorkLogRecurrenceDto | null;
}
