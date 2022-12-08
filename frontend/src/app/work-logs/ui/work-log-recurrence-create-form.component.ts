import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence-dto';
import { FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { timeStringToMinutes } from '@shared/config/functions/duration.functions';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { TimeTrackInputComponent } from '@shared/ui/input/time-track-input.component';
import { WeekDaySelectComponent } from '@shared/ui/input/week-day-select.component';
import { DEFAULT_WORK_LOG_MINUTES_LOGGED, DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE } from '@work-logs/config/work-log.constants';
import { WorkLogRecurrenceCreateFormModalData } from '@work-logs/config/work-log.interfaces';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-work-log-recurrence-create-form',
                template       : `
                    <app-form-modal
                        title="Setup recurrent work log"
                        (onCancelBtnClick)="cancel()"
                        (onSaveBtnClick)="submit()">
                        <form *ngIf="form" [formGroup]="form">
                            <app-select-input
                                appInput
                                label="Project"
                                formControlName="projectId"
                                [options]="(data.projectOptions$ | async)!"
                                [required]="true"></app-select-input>
                            <app-time-track-input
                                appInput
                                label="Time worked"
                                formControlName="minutesLogged"
                                [required]="true"></app-time-track-input>
                            <app-week-day-select
                                appInput
                                formControlName="weekDays"
                                [required]="true"></app-week-day-select>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    ReactiveFormsModule,
                    CommonModule,
                    FormModalComponent,
                    SelectInputComponent,
                    TimeTrackInputComponent,
                    WeekDaySelectComponent,
                    InputModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WorkLogRecurrenceCreateFormComponent extends AbstractForm<CreateWorkLogRecurrenceDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<CreateWorkLogRecurrenceDto>;
    override initialValues = null;

    constructor(
        @Inject( MAT_DIALOG_DATA ) public data: WorkLogRecurrenceCreateFormModalData
    ) {
        super( { loadingSrc$: data.loading$ } );
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
        this.handleProjectSelectInputState( this.data.projectOptionsLoading$ );
    }

    override submit(): void {
        const minutesLogged = timeStringToMinutes( this.form.value.minutesLogged!.toString() )!;
        super.submit( { ...this.form.getRawValue(), minutesLogged } );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<CreateWorkLogRecurrenceDto> {
        return {
            minutesLogged: [ DEFAULT_WORK_LOG_MINUTES_LOGGED, Validators.required ],
            projectId    : [ '', Validators.required ],
            weekDays     : [ DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE, Validators.required ]
        };
    }

    private handleProjectSelectInputState(loading$: Observable<boolean>): void {
        loading$.pipe( takeUntilDestroy( this ) )
                .subscribe( isLoading => {
                    const input = this.form.controls.projectId;
                    isLoading
                    ? input.disable()
                    : input.enable();
                } );
    }
}
