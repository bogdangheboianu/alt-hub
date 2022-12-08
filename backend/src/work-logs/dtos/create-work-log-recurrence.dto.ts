import { ApiProperty } from '@nestjs/swagger';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class CreateWorkLogRecurrenceDto {
    minutesLogged!: number;
    projectId!: string;
    @ApiProperty( { enum: WeekDayEnum, enumName: 'WeekDayEnum', nullable: true } )
    weekDays!: WeekDayEnum[];
}
