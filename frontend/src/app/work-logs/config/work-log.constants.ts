import { WeekDayNumericEnum } from '@shared/config/constants/shared.constants';

export enum WorkLogSuccessMessage {
    Created  = 'Time logged successfully',
    Updated  = 'Work log successfully updated',
    Imported = 'Work logs successfully imported',
    Deleted  = 'Work log deleted successfully'
}

export enum WorkLogRecurrenceSuccessMessage {
    Created       = 'Recurrent work log saved successfully',
    Updated       = 'Recurrent work log saved successfully',
    StatusUpdated = 'Recurrent work log status successfully updated',
    Deleted       = 'Recurrent work log successfully deleted'
}

export const DEFAULT_WORK_LOG_MINUTES_LOGGED = 480;
export const DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE = [
    WeekDayNumericEnum.Monday,
    WeekDayNumericEnum.Tuesday,
    WeekDayNumericEnum.Wednesday,
    WeekDayNumericEnum.Thursday,
    WeekDayNumericEnum.Friday
];
