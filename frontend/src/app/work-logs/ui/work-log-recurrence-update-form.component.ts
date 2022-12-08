import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence-dto';
import { FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { timeStringToMinutes } from '@shared/config/functions/duration.functions';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { TimeTrackInputComponent } from '@shared/ui/input/time-track-input.component';
import { WeekDaySelectComponent } from '@shared/ui/input/week-day-select.component';
import { WorkLogRecurrenceUpdateFormModalData } from '@work-logs/config/work-log.interfaces';
import { WorkLogPipesModule } from '@work-logs/pipes/work-log-pipes.module';

@Component( {
                standalone     : true,
                selector       : 'app-work-log-recurrence-update-form',
                template       : `
                    <app-form-modal
                        [title]="'Update recurrent work log for project ' + (data.initialValues | workLogRecurrenceProjectName)"
                        [showDeleteButton]="true"
                        (onCancelBtnClick)="cancel()"
                        (onSaveBtnClick)="submit()"
                        (onDeleteBtnClick)="delete()">
                        <form *ngIf="form" [formGroup]="form">
                            <app-time-track-input
                                appInput
                                label="Time worked"
                                formControlName="minutesLogged"
                                [required]="true"></app-time-track-input>
                            <app-week-day-select
                                appInput
                                formControlName="weekDays" [required]="true"></app-week-day-select>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    CommonModule,
                    ReactiveFormsModule,
                    FormModalComponent,
                    WorkLogPipesModule,
                    TimeTrackInputComponent,
                    InputModule,
                    WeekDaySelectComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class WorkLogRecurrenceUpdateFormComponent extends AbstractForm<UpdateWorkLogRecurrenceDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<UpdateWorkLogRecurrenceDto>;
    override initialValues = null;

    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: WorkLogRecurrenceUpdateFormModalData
    ) {
        super( { loadingSrc$: data.loading$ } );
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
    }

    override async submit(): Promise<void> {
        const minutesLogged = timeStringToMinutes( this.form.value.minutesLogged!.toString() )!;
        super.submit( { ...this.form.getRawValue(), minutesLogged } );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    delete(): void {
        this.data.onDelete();
    }

    protected override formFields(): FormFields<UpdateWorkLogRecurrenceDto> {
        return {
            minutesLogged: [ this.data.initialValues.minutesLogged, Validators.required ],
            weekDays     : [ this.data.initialValues.weekDays, Validators.required ]
        };
    }
}
