import { NgModule } from '@angular/core';
import { VacationHasDateIntervalPipe } from '../pipes/vacation-has-date-interval.pipe';

const Pipes = [
    VacationHasDateIntervalPipe
];

@NgModule( {
               declarations: Pipes,
               exports     : Pipes
           } )
export class VacationPipesModule {
}
