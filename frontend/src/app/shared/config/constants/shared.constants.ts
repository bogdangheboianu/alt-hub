import { WeekDayEnum } from '@dtos/week-day-enum';

export const CORRELATION_ID_HEADER = 'X-CORRELATION-ID';
export const AUTHORIZATION_HEADER = 'Authorization';

export const DEFAULT_PAGE_NUMBER = 0;
export const DEFAULT_ITEMS_PER_PAGE = 40;

export enum WeekDayNumericEnum {
    Monday    = 0,
    Tuesday   = 1,
    Wednesday = 2,
    Thursday  = 3,
    Friday    = 4,
    Saturday  = 5,
    Sunday    = 6
}

export const WeekDaysMap = {
    [WeekDayEnum.Monday]   : WeekDayNumericEnum.Monday,
    [WeekDayEnum.Tuesday]  : WeekDayNumericEnum.Tuesday,
    [WeekDayEnum.Wednesday]: WeekDayNumericEnum.Wednesday,
    [WeekDayEnum.Thursday] : WeekDayNumericEnum.Thursday,
    [WeekDayEnum.Friday]   : WeekDayNumericEnum.Friday,
    [WeekDayEnum.Saturday] : WeekDayNumericEnum.Saturday,
    [WeekDayEnum.Sunday]   : WeekDayNumericEnum.Sunday
};

