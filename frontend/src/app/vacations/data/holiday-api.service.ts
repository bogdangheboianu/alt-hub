import { Injectable } from '@angular/core';
import { HolidayDto } from '@dtos/holiday-dto';
import { ApiResult } from '@shared/api/api-result';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiService } from '@shared/api/api.service';
import { HolidayStore } from '@vacations/data/holiday.store';
import { Observable } from 'rxjs';

@Injectable()
export class HolidayApiService extends ApiService {
    constructor(private holidayStore: HolidayStore) {
        super( holidayStore );
    }

    getAllHolidays(): Observable<ApiResult<HolidayDto[]>> {
        return this.get( apiRoutes.holidays.base, this.holidayStore.onHolidayListLoaded.bind( this.holidayStore ) );
    }
}
