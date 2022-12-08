import { ApiProperty } from '@nestjs/swagger';
import { AuditDto } from '@shared/dtos/audit.dto';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class HolidayDto {
    id!: string;
    name!: string;
    date!: Date;
    @ApiProperty( { enum: WeekDayEnum, enumName: 'WeekDayEnum' } )
    weekDay!: WeekDayEnum;
    audit!: AuditDto;
}
