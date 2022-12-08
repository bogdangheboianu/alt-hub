import { NgModule } from '@angular/core';
import { HolidayApiService } from '@vacations/data/holiday-api.service';
import { HolidayActions } from '@vacations/data/holiday.actions';
import { HolidaySelectors } from '@vacations/data/holiday.selectors';
import { HolidayStore } from '@vacations/data/holiday.store';
import { VacationApiService } from '@vacations/data/vacation-api.service';
import { VacationActions } from '@vacations/data/vacation.actions';
import { VacationSelectors } from '@vacations/data/vacation.selectors';
import { VacationStore } from '@vacations/data/vacation.store';

@NgModule( {
               providers: [
                   VacationStore,
                   VacationActions,
                   VacationSelectors,
                   VacationApiService,
                   HolidayStore,
                   HolidayApiService,
                   HolidayActions,
                   HolidaySelectors
               ]
           } )
export class VacationDataModule {
}
