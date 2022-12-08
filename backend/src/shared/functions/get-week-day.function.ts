import { WeekDayEnum } from '@work-logs/enums/week-day.enum';

export const getWeekDay = (date: string | Date): WeekDayEnum => {
    const day = new Date( date ).getDay();
    return day === 0
           ? 6
           : day - 1;
};
