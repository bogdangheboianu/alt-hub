import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectModule } from '@project/project.module';
import { SharedModule } from '@shared/shared.module';
import { CreateWorkLogFormComponent } from '@work-log/components/create-work-log-form/create-work-log-form.component';
import { CreateWorkLogRecurrenceFormComponent } from '@work-log/components/create-work-log-recurrence-form/create-work-log-recurrence-form.component';
import { LogWorkButtonComponent } from '@work-log/components/log-work-button/log-work-button.component';
import { RecurrentWorkLogButtonComponent } from '@work-log/components/recurrent-work-log-button/recurrent-work-log-button.component';
import { TimeWorkedInputComponent } from '@work-log/components/time-worked-input/time-worked-input.component';
import { UpdateWorkLogFormComponent } from '@work-log/components/update-work-log-form/update-work-log-form.component';
import { UpdateWorkLogRecurrenceFormComponent } from '@work-log/components/update-work-log-recurrence-form/update-work-log-recurrence-form.component';
import { WeekDaySelectComponent } from '@work-log/components/week-day-select/week-day-select.component';
import { WorkLogRecurrencesTableComponent } from '@work-log/components/work-log-recurrences-table/work-log-recurrences-table.component';
import { WorkLogsFiltersComponent } from '@work-log/components/work-logs-filters/work-logs-filters.component';
import { WorkLogsTableComponent } from '@work-log/components/work-logs-table/work-logs-table.component';
import { WorkLogListPageComponent } from '@work-log/pages/work-log-list-page/work-log-list-page.component';
import { WorkLogRecurrenceService } from '@work-log/services/work-log-recurrence.service';
import { WorkLogService } from '@work-log/services/work-log.service';
import { WorkLogRecurrenceActions } from '@work-log/store/work-log-recurrence/work-log-recurrence.actions';
import { WorkLogRecurrenceSelectors } from '@work-log/store/work-log-recurrence/work-log-recurrence.selectors';
import { WorkLogRecurrenceStore } from '@work-log/store/work-log-recurrence/work-log-recurrence.store';
import { WorkLogUiEvents } from '@work-log/store/work-log/work-log-ui.events';
import { WorkLogActions } from '@work-log/store/work-log/work-log.actions';
import { WorkLogSelectors } from '@work-log/store/work-log/work-log.selectors';
import { WorkLogStore } from '@work-log/store/work-log/work-log.store';
import { WorkLogRoutingModule } from '@work-log/work-log-routing.module';

@NgModule( {
               declarations: [
                   CreateWorkLogFormComponent,
                   UpdateWorkLogFormComponent,
                   WorkLogsTableComponent,
                   LogWorkButtonComponent,
                   RecurrentWorkLogButtonComponent,
                   WeekDaySelectComponent,
                   CreateWorkLogRecurrenceFormComponent,
                   WorkLogRecurrencesTableComponent,
                   WorkLogListPageComponent,
                   WorkLogsFiltersComponent,
                   TimeWorkedInputComponent,
                   UpdateWorkLogRecurrenceFormComponent
               ],
               imports     : [
                   CommonModule,
                   WorkLogRoutingModule,
                   MatDialogModule,
                   MatButtonModule,
                   ReactiveFormsModule,
                   MatFormFieldModule,
                   MatAutocompleteModule,
                   MatInputModule,
                   MatDatepickerModule,
                   ProjectModule,
                   MatTableModule,
                   MatPaginatorModule,
                   SharedModule,
                   MatButtonToggleModule,
                   MatCheckboxModule,
                   FormsModule,
                   MatIconModule,
                   MatSlideToggleModule,
                   MatTooltipModule
               ],
               providers   : [
                   WorkLogService,
                   WorkLogActions,
                   WorkLogSelectors,
                   WorkLogStore,
                   WorkLogRecurrenceStore,
                   WorkLogRecurrenceActions,
                   WorkLogRecurrenceSelectors,
                   WorkLogRecurrenceService,
                   WorkLogUiEvents
               ],
               exports     : [
                   WorkLogsTableComponent,
                   LogWorkButtonComponent,
                   RecurrentWorkLogButtonComponent,
                   WorkLogRecurrencesTableComponent
               ]
           } )
export class WorkLogModule {
}
