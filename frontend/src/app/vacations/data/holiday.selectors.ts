import { Injectable } from '@angular/core';
import { BaseEntitySelector } from '@config/store/store.models';
import { HolidayDto } from '@dtos/holiday-dto';
import { HolidayState, HolidayStore } from '@vacations/data/holiday.store';

@Injectable()
export class HolidaySelectors extends BaseEntitySelector<HolidayDto, HolidayState> {
    constructor(private holidayStore: HolidayStore) {
        super( holidayStore );
    }
}
