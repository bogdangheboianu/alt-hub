import { ApiProperty } from '@nestjs/swagger';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class UpdateWorkLogRecurrenceDto {
    minutesLogged!: number;
    @ApiProperty( { enum: WeekDayEnum, enumName: 'WeekDayEnum', nullable: true } )
    weekDays!: WeekDayEnum[];
}
