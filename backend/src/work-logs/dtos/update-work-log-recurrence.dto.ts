import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class UpdateWorkLogRecurrenceDto {
    minutesLogged!: number;
    weekDays!: WeekDayEnum[];
}
