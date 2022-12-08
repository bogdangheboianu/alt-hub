import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateWorkLogDto } from '@dtos/update-work-log-dto';
import { FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { timeStringToMinutes } from '@shared/config/functions/duration.functions';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { DateInputComponent } from '@shared/ui/input/date-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { TextareaInputComponent } from '@shared/ui/input/textarea-input.component';
import { TimeTrackInputComponent } from '@shared/ui/input/time-track-input.component';
import { WorkLogUpdateFormModalData } from '@work-logs/config/work-log.interfaces';
import { WorkLogUiEvents } from '@work-logs/data/work-log-ui.events';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-work-log-update-form',
                template       : `
                    <app-form-modal
                        title="Update work log"
                        [showDeleteButton]="true"
                        (onCancelBtnClick)="cancel()"
                        (onSaveBtnClick)="submit()"
                        (onDeleteBtnClick)="delete()">
                        <form *ngIf="form" [formGroup]="form">
                            <app-select-input
                                appInput label="Project"
                                formControlName="projectId"
                                [options]="(data.projectOptions$ | async)!"
                                [required]="true"></app-select-input>
                            <app-time-track-input
                                appInput
                                label="Time worked"
                                formControlName="minutesLogged"
                                [required]="true"></app-time-track-input>
                            <app-date-input
                                appInput label="Date"
                                formControlName="date"
                                [maxDate]="today"
                                [required]="true"></app-date-input>
                            <app-textarea-input
                                appInput
                                label="Description"
                                formControlName="description"></app-textarea-input>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    CommonModule,
                    ReactiveFormsModule,
                    FormModalComponent,
                    SelectInputComponent,
                    InputModule,
                    TimeTrackInputComponent,
                    DateInputComponent,
                    TextareaInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WorkLogUpdateFormComponent extends AbstractForm<UpdateWorkLogDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<UpdateWorkLogDto>;
    override initialValues = null;

    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: WorkLogUpdateFormModalData,
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
        this.uiEvents.onUpdateWorkLogFormOpened();
        this.handleProjectSelectInputState( this.data.projectOptionsLoading$ );
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

    protected override formFields(): FormFields<UpdateWorkLogDto> {
        return {
            description  : [ this.data.initialValues.description ],
            minutesLogged: [ this.data.initialValues.minutesLogged, Validators.required ],
            projectId    : [ this.data.initialValues.project!.id, Validators.required ],
            date         : [ this.data.initialValues.date, Validators.required ]
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
