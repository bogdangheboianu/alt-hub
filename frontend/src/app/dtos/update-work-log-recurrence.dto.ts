import { WeekDayEnum } from '@dtos/week-day.enum';

export class UpdateWorkLogRecurrenceDto {
    minutesLogged!: number;
    weekDays!: WeekDayEnum[];
}
