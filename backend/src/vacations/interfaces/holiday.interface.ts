import { Audit } from '@shared/models/audit/audit';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { HolidayId } from '@vacations/models/holiday-id';
import { HolidayName } from '@vacations/models/holiday-name';
import { WeekDay } from '@work-logs/models/week-day';

export interface IHoliday {
    id?: HolidayId;
    name: HolidayName;
    date: MandatoryDate;
    weekDay: WeekDay;
    audit?: Audit;
}
