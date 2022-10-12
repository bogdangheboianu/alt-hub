import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStep } from '@angular/material/stepper';
import { CreateProjectDto } from '@dtos/create-project.dto';
import { CreateProjectInfoStepComponent } from '@project/components/create-project-stepper/steps/create-project-info-step/create-project-info-step.component';
import { CreateProjectSaveStepComponent } from '@project/components/create-project-stepper/steps/create-project-save-step/create-project-save-step.component';
import { CreateProjectTimelineStepComponent } from '@project/components/create-project-stepper/steps/create-project-timeline-step/create-project-timeline-step.component';
import { ProjectOperationMessage } from '@project/constants/project-operation-message.enum';
import { ProjectUiEvents } from '@project/store/project-ui.events';
import { ProjectActions } from '@project/store/project.actions';
import { ProjectSelectors } from '@project/store/project.selectors';
import { ProjectStore } from '@project/store/project.store';
import { SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { BaseStepper } from '@shared/directives/base-stepper.directive';
import { Steps } from '@shared/types/steps.type';
import { UntilDestroy } from 'ngx-reactivetoolkit';

export type CreateProjectStepKey = 'projectInfo' | 'projectTimeline' | 'projectSave';

@Component( {
                selector   : 'app-create-project-stepper',
                templateUrl: './create-project-stepper.component.html',
                styleUrls  : [ './create-project-stepper.component.scss' ]
            } )
@UntilDestroy()
export class CreateProjectStepperComponent extends BaseStepper<CreateProjectDto, CreateProjectStepKey> implements OnInit {
    @ViewChild( CreateProjectInfoStepComponent )
    projectInfoStepContent!: CreateProjectInfoStepComponent;

    @ViewChild( CreateProjectTimelineStepComponent )
    projectTimelineStepContent!: CreateProjectTimelineStepComponent;

    @ViewChild( CreateProjectSaveStepComponent )
    projectSaveStepContent!: CreateProjectSaveStepComponent;

    @ViewChild( 'projectTimelineStep' )
    projectTimelineStep!: MatStep;

    @ViewChild( 'projectInfoStep' )
    projectInfoStep!: MatStep;

    @ViewChild( 'projectSaveStep' )
    projectSaveStep!: MatStep;

    constructor(
        private dialogRef: MatDialogRef<CreateProjectStepperComponent>,
        private projectActions: ProjectActions,
        private projectSelectors: ProjectSelectors,
        private projectUiEvents: ProjectUiEvents,
        private projectStore: ProjectStore
    ) {
        super( projectSelectors, projectSelectors.selectNewProjectData.bind( projectSelectors ) );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.projectUiEvents.onCreateProjectStepperOpened();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    protected override getSteps(): Steps<CreateProjectStepKey> {
        return {
            projectInfo    : {
                label    : 'Basic info',
                component: this.projectInfoStep,
                content  : this.projectInfoStepContent,
                editable : true
            },
            projectTimeline: {
                label    : 'Timeline',
                component: this.projectTimelineStep,
                content  : this.projectTimelineStepContent,
                editable : true,
                optional : true
            },
            projectSave    : {
                label    : 'Save',
                component: this.projectSaveStep,
                content  : this.projectSaveStepContent,
                editable : false
            }
        };
    }

    protected override onSubmit(data: CreateProjectDto): void {
        this.projectActions.createProject( data );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage | void {
        this.projectStore.resetNewProject();
        this.closeDialog();
        return ProjectOperationMessage.Created;
    }
}
