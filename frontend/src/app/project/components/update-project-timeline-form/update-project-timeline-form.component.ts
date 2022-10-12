import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline.dto';
import { ProjectOperationMessage } from '@project/constants/project-operation-message.enum';
import { IUpdateProjectTimelineFormInputData } from '@project/interfaces/update-project-timeline-form-input-data.interface';
import { ProjectActions } from '@project/store/project.actions';
import { ProjectSelectors } from '@project/store/project.selectors';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { ISelectInputOption } from '@shared/interfaces/select-input-option.interface';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-update-project-timeline-form',
                templateUrl: './update-project-timeline-form.component.html',
                styleUrls  : [ './update-project-timeline-form.component.scss' ]
            } )
@UntilDestroy()
export class UpdateProjectTimelineFormComponent extends BaseForm<UpdateProjectTimelineDto> implements OnInit {
    form!: FormGroupTyped<UpdateProjectTimelineDto>;

    constructor(
        @Inject( MAT_DIALOG_DATA ) private readonly data: IUpdateProjectTimelineFormInputData,
        private readonly dialogRef: MatDialogRef<UpdateProjectTimelineFormComponent>,
        private readonly formBuilder: FormBuilder,
        private readonly projectSelectors: ProjectSelectors,
        private readonly projectActions: ProjectActions
    ) {
        super( projectSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    close(): void {
        this.dialogRef.close();
    }

    clientOptionDisplay(client: ISelectInputOption): string {
        return client.name;
    }

    protected buildForm(): FormGroupTyped<UpdateProjectTimelineDto> {
        const fields: FormFields<UpdateProjectTimelineDto> = {
            startDate: [ this.data.initialValues.startDate ?? null ],
            endDate  : [ this.data.initialValues.endDate ?? null ],
            deadline : [ this.data.initialValues.deadline ?? null ]
        };
        return this.formBuilder.nonNullable.group<UpdateProjectTimelineDto>( fields );
    }

    protected onSubmit() {
        this.projectActions.updateProjectTimeline( this.data.projectId, this.form.getRawValue() );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage {
        this.close();
        return ProjectOperationMessage.TimelineUpdated;
    }
}
