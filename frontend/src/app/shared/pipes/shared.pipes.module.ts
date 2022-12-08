import { NgModule } from '@angular/core';
import { CreatedAtPipe } from '@shared/pipes/created-at.pipe';
import { EnumToSelectInputOptionsPipe } from '@shared/pipes/enum-to-select-input-options.pipe';
import { MinutesToReadableTimePipe } from '@shared/pipes/minutes-to-readable-time.pipe';
import { MoneyAmountPipe } from '@shared/pipes/money-amount.pipe';
import { ReadableDatePipe } from '@shared/pipes/readable-date.pipe';
import { ReadableWeekDaysPipe } from '@shared/pipes/readable-week-days.pipe';
import { StartCasePipe } from '@shared/pipes/start-case.pipe';

const Pipes = [
    CreatedAtPipe,
    MinutesToReadableTimePipe,
    ReadableDatePipe,
    ReadableWeekDaysPipe,
    StartCasePipe,
    MoneyAmountPipe,
    EnumToSelectInputOptionsPipe
];

@NgModule( {
               declarations: Pipes,
               exports     : Pipes
           } )
export class SharedPipesModule {
}
