import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class CreateHolidayDto {
    name!: string;
    date!: Date;
    weekDay!: WeekDayEnum;
}
