import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export class CreateWorkLogRecurrenceDto {
    minutesLogged!: number;
    projectId!: string;
    weekDays!: WeekDayEnum[];
}
