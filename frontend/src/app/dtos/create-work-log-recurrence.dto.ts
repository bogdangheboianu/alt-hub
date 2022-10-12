import { WeekDayEnum } from '@dtos/week-day.enum';

export class CreateWorkLogRecurrenceDto {
    minutesLogged!: number;
    projectId!: string;
    weekDays!: WeekDayEnum[];
}
