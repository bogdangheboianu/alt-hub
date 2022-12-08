import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { HolidayApiService } from '@vacations/data/holiday-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HolidayActions {
    constructor(private holidayApiService: HolidayApiService) {
    }

    @action( 'Load all holidays' )
    loadAllHolidays(): void {
        firstValueFrom( this.holidayApiService.getAllHolidays() )
            .then();
    }
}
