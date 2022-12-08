import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateWorkLogsDto } from '@dtos/create-work-logs-dto';
import { FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { timeStringToMinutes } from '@shared/config/functions/duration.functions';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { multipleDatesRequiredValidator } from '@shared/ui/input/input.validators';
import { MultipleDatesInputComponent } from '@shared/ui/input/multiple-dates-input.component';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { TextareaInputComponent } from '@shared/ui/input/textarea-input.component';
import { TimeTrackInputComponent } from '@shared/ui/input/time-track-input.component';
import { WeekDaySelectComponent } from '@shared/ui/input/week-day-select.component';
import { DEFAULT_WORK_LOG_MINUTES_LOGGED, DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE } from '@work-logs/config/work-log.constants';
import { WorkLogCreateFormModalData } from '@work-logs/config/work-log.interfaces';
import { WorkLogUiEvents } from '@work-logs/data/work-log-ui.events';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-work-log-create-form',
                template       : `
                    <app-form-modal
                        title="Log your work"
                        [loading]="loading"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()">
                        <form *ngIf="form" [formGroup]="form">
                            <app-select-input
                                appInput
                                formControlName="projectId"
                                label="Project"
                                [options]="(data.projectOptions$ | async)!"
                                [required]="true"></app-select-input>
                            <app-time-track-input
                                appInput
                                formControlName="minutesLogged"
                                label="Time worked"
                                [required]="true"></app-time-track-input>
                            <app-multiple-dates-input
                                appInput
                                formControlName="dates"
                                label="Dates"
                                [maxDate]="today"
                                [required]="true"></app-multiple-dates-input>
                            <app-textarea-input
                                appInput
                                formControlName="description"
                                label="Description"></app-textarea-input>
                            <mat-checkbox
                                (change)="recurrenceCheckboxChange($event)"
                                [checked]="(showRecurrenceWeekDaySelect$ | async)!"
                                style="margin-bottom: 20px">Repeat
                            </mat-checkbox>
                            <app-week-day-select
                                appInput
                                *ngIf="(showRecurrenceWeekDaySelect$ | async)!"
                                formControlName="weekDaysRecurrence"></app-week-day-select>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    FormModalComponent,
                    CommonModule,
                    ReactiveFormsModule,
                    SelectInputComponent,
                    InputModule,
                    TimeTrackInputComponent,
                    MultipleDatesInputComponent,
                    TextareaInputComponent,
                    MatCheckboxModule,
                    WeekDaySelectComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WorkLogCreateFormComponent extends AbstractForm<CreateWorkLogsDto> {
    override loading = false;
    override onSubmit: SubmitFn<CreateWorkLogsDto>;
    override initialValues = null;
    showRecurrenceWeekDaySelect$ = new BehaviorSubject( false );

    constructor(
        @Inject( MAT_DIALOG_DATA ) public data: WorkLogCreateFormModalData,
        private readonly uiEvents: WorkLogUiEvents
    ) {
        super( { loadingSrc$: data.loading$ } );
        this.onSubmit = data.onSubmit;
    }

    get today() {
        return new Date();
    }

    ngOnInit(): void {
        this.init();
        this.uiEvents.onCreateWorkLogFormOpened();
        this.handleProjectSelectInputState( this.data.projectOptionsLoading$ );
    }

    override async submit(): Promise<void> {
        const { weekDaysRecurrence: wdr } = this.form.value;
        const createRecurrence = await firstValueFrom( this.showRecurrenceWeekDaySelect$ );
        const weekDaysRecurrence = valueIsEmpty( wdr ) || !createRecurrence
                                   ? undefined
                                   : wdr;
        const minutesLogged = timeStringToMinutes( this.form.value.minutesLogged!.toString() )!;
        super.submit( { ...this.form.getRawValue(), weekDaysRecurrence, minutesLogged } );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    recurrenceCheckboxChange(event: MatCheckboxChange): void {
        this.showRecurrenceWeekDaySelect$.next( event.checked );
    }

    protected override formFields(): FormFields<CreateWorkLogsDto> {
        return {
            description       : [ '' ],
            minutesLogged     : [ DEFAULT_WORK_LOG_MINUTES_LOGGED, Validators.required ],
            dates             : [ [ this.today ], multipleDatesRequiredValidator() ],
            projectId         : [ '', Validators.required ],
            weekDaysRecurrence: [ DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE ]
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
