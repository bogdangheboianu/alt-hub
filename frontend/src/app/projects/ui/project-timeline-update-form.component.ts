import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectTimelineDto } from '@dtos/project-timeline-dto';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline-dto';
import { ProjectTimelineUpdateFormModalData } from '@projects/config/project.interfaces';
import { FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { DateInputComponent } from '@shared/ui/input/date-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-project-timeline-update-form',
                template       : `
                    <app-form-modal title="Update project timeline"
                                    [loading]="loading"
                                    (onSaveBtnClick)="submit()"
                                    (onCancelBtnClick)="cancel()">
                        <form *ngIf="form" [formGroup]="form">
                            <app-date-input appInput
                                            label="Start date"
                                            formControlName="startDate"
                                            [autoFocus]="data.focusOnInput === 'startDate'"></app-date-input>
                            <app-date-input appInput
                                            label="End date"
                                            formControlName="endDate"
                                            [autoFocus]="data.focusOnInput === 'endDate'"></app-date-input>
                            <app-date-input appInput
                                            label="Deadline"
                                            formControlName="deadline"
                                            [autoFocus]="data.focusOnInput === 'deadline'"></app-date-input>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    CommonModule,
                    FormModalComponent,
                    ReactiveFormsModule,
                    DateInputComponent,
                    InputModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectTimelineUpdateFormComponent extends AbstractForm<UpdateProjectTimelineDto, ProjectTimelineDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<UpdateProjectTimelineDto>;
    override initialValues: ProjectTimelineDto;

    constructor(@Inject( MAT_DIALOG_DATA ) public data: ProjectTimelineUpdateFormModalData) {
        super( { loadingSrc$: data.loading$ } );
        this.initialValues = data.initialValues;
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<UpdateProjectTimelineDto> {
        return {
            startDate: [ this.data.initialValues.startDate ?? null ],
            endDate  : [ this.data.initialValues.endDate ?? null ],
            deadline : [ this.data.initialValues.deadline ?? null ]
        };
    }
}
