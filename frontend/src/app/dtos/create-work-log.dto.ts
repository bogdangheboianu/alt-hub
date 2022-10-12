import { WeekDayEnum } from '@dtos/week-day.enum';

export class CreateWorkLogDto {
    description?: string | null;
    minutesLogged!: number;
    date!: Date;
    projectId!: string;
    weekDaysRecurrence?: WeekDayEnum[];
}
