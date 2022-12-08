import { ApiProperty } from '@nestjs/swagger';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class CreateWorkLogsDto {
    description?: string | null;
    minutesLogged!: number;
    dates!: Date[];
    projectId!: string;
    @ApiProperty( { enum: WeekDayEnum, enumName: 'WeekDayEnum', nullable: true } )
    weekDaysRecurrence?: WeekDayEnum[];
}
