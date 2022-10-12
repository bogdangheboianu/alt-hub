import { AuditDto } from '@dtos/audit.dto';
import { ProjectDto } from '@dtos/project.dto';
import { UserDto } from '@dtos/user.dto';
import { WeekDayEnum } from '@dtos/week-day.enum';

export class WorkLogRecurrenceDto {
    id!: string;
    minutesLogged!: number;
    user!: UserDto;
    project!: ProjectDto;
    weekDays!: WeekDayEnum[];
    active!: boolean;
    audit!: AuditDto;
}
