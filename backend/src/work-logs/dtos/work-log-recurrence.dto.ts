import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '@projects/dtos/project.dto';
import { AuditDto } from '@shared/dtos/audit.dto';
import { UserDto } from '@users/dtos/user.dto';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class WorkLogRecurrenceDto {
    id!: string;
    minutesLogged!: number;
    user!: UserDto;
    project!: ProjectDto;
    @ApiProperty( { enum: WeekDayEnum, enumName: 'WeekDayEnum', nullable: true } )
    weekDays!: WeekDayEnum[];
    active!: boolean;
    audit!: AuditDto;
}
