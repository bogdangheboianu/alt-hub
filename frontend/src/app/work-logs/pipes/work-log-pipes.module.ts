import { NgModule } from '@angular/core';
import { WorkLogProjectNamePipe } from '@work-logs/pipes/work-log-project-name.pipe';
import { WorkLogRecurrenceProjectNamePipe } from '@work-logs/pipes/work-log-recurrence-project-name.pipe';
import { WorkLogUserFullNamePipe } from '@work-logs/pipes/work-log-user-full-name.pipe';

const Pipes = [
    WorkLogProjectNamePipe,
    WorkLogUserFullNamePipe,
    WorkLogRecurrenceProjectNamePipe
];

@NgModule( {
               declarations: Pipes,
               exports     : Pipes
           } )
export class WorkLogPipesModule {
}
