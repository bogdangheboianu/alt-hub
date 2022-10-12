import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthModule } from '@auth/auth.module';
import { ClientModule } from '@client/client.module';
import { CreateProjectInfoFormComponent } from '@project/components/create-project-info-form/create-project-info-form.component';
import { CreateProjectStepperComponent } from '@project/components/create-project-stepper/create-project-stepper.component';
import { CreateProjectTimelineFormComponent } from '@project/components/create-project-timeline-form/create-project-timeline-form.component';
import { ProjectStatusLabelComponent } from '@project/components/project-status-label/project-status-label.component';
import { ProjectTimelineDateComponent } from '@project/components/project-timeline-date/project-timeline-date.component';
import { ProjectTimelineComponent } from '@project/components/project-timeline/project-timeline.component';
import { ProjectsTableComponent } from '@project/components/projects-table/projects-table.component';
import { UpdateProjectTimelineFormComponent } from '@project/components/update-project-timeline-form/update-project-timeline-form.component';
import { ProjectListPageComponent } from '@project/pages/project-list-page/project-list-page.component';
import { ProjectPageComponent } from '@project/pages/project-page/project-page.component';
import { ProjectRoutingModule } from '@project/project-routing.module';
import { ProjectService } from '@project/services/project.service';
import { ProjectUiEvents } from '@project/store/project-ui.events';
import { ProjectActions } from '@project/store/project.actions';
import { ProjectSelectors } from '@project/store/project.selectors';
import { ProjectStore } from '@project/store/project.store';
import { SharedModule } from '@shared/shared.module';
import { CreateProjectInfoStepComponent } from './components/create-project-stepper/steps/create-project-info-step/create-project-info-step.component';
import { CreateProjectTimelineStepComponent } from './components/create-project-stepper/steps/create-project-timeline-step/create-project-timeline-step.component';
import { CreateProjectSaveStepComponent } from './components/create-project-stepper/steps/create-project-save-step/create-project-save-step.component';

@NgModule( {
               declarations: [
                   ProjectListPageComponent,
                   ProjectPageComponent,
                   CreateProjectStepperComponent,
                   CreateProjectInfoFormComponent,
                   CreateProjectTimelineFormComponent,
                   ProjectsTableComponent,
                   ProjectStatusLabelComponent,
                   ProjectTimelineComponent,
                   ProjectTimelineDateComponent,
                   UpdateProjectTimelineFormComponent,
                   CreateProjectInfoStepComponent,
                   CreateProjectTimelineStepComponent,
                   CreateProjectSaveStepComponent
               ],
               imports     : [
                   CommonModule,
                   ProjectRoutingModule,
                   FlexModule,
                   MatCardModule,
                   SharedModule,
                   MatButtonModule,
                   ReactiveFormsModule,
                   MatFormFieldModule,
                   MatInputModule,
                   MatDatepickerModule,
                   MatNativeDateModule,
                   MatAutocompleteModule,
                   ClientModule,
                   MatStepperModule,
                   AuthModule,
                   MatTableModule,
                   MatProgressBarModule,
                   MatTooltipModule,
                   MatIconModule,
                   MatMenuModule
               ],
               providers   : [
                   ProjectStore,
                   ProjectSelectors,
                   ProjectActions,
                   ProjectService,
                   ProjectUiEvents
               ]
           } )
export class ProjectModule {
}
