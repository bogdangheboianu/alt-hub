import { NgModule } from '@angular/core';
import { WorkLogApiService } from '@work-logs/data/work-log-api.service';
import { WorkLogRecurrenceApiService } from '@work-logs/data/work-log-recurrence-api.service';
import { WorkLogRecurrenceActions } from '@work-logs/data/work-log-recurrence.actions';
import { WorkLogRecurrenceSelectors } from '@work-logs/data/work-log-recurrence.selectors';
import { WorkLogRecurrenceStore } from '@work-logs/data/work-log-recurrence.store';
import { WorkLogUiEvents } from '@work-logs/data/work-log-ui.events';
import { WorkLogActions } from '@work-logs/data/work-log.actions';
import { WorkLogSelectors } from '@work-logs/data/work-log.selectors';
import { WorkLogStore } from '@work-logs/data/work-log.store';

@NgModule( {
               providers: [
                   WorkLogActions,
                   WorkLogStore,
                   WorkLogSelectors,
                   WorkLogApiService,
                   WorkLogUiEvents,
                   WorkLogRecurrenceStore,
                   WorkLogRecurrenceActions,
                   WorkLogRecurrenceSelectors,
                   WorkLogRecurrenceApiService
               ]
           } )
export class WorkLogDataModule {
}
