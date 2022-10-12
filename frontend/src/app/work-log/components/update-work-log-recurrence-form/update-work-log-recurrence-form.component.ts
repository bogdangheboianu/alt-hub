import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence.dto';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { timeStringToMinutes } from '@shared/functions/duration.functions';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { WorkLogRecurrenceOperationMessage } from '@work-log/constants/work-log-recurrence-operation-message.enum';
import { IWorkLogRecurrenceDialogData } from '@work-log/interfaces/work-log-recurrence-dialog-data.interface';
import { WorkLogRecurrenceActions } from '@work-log/store/work-log-recurrence/work-log-recurrence.actions';
import { WorkLogRecurrenceSelectors } from '@work-log/store/work-log-recurrence/work-log-recurrence.selectors';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-update-work-log-recurrence-form',
                templateUrl: './update-work-log-recurrence-form.component.html',
                styleUrls  : [ './update-work-log-recurrence-form.component.scss' ]
            } )
@UntilDestroy()
export class UpdateWorkLogRecurrenceFormComponent extends BaseForm<UpdateWorkLogRecurrenceDto> implements OnInit {
    form!: FormGroupTyped<UpdateWorkLogRecurrenceDto>;

    constructor(
        @Inject( MAT_DIALOG_DATA ) public data: IWorkLogRecurrenceDialogData,
        public dialogRef: MatDialogRef<UpdateWorkLogRecurrenceFormComponent>,
        private formBuilder: FormBuilder,
        private workLogRecurrenceActions: WorkLogRecurrenceActions,
        private workLogRecurrenceSelectors: WorkLogRecurrenceSelectors
    ) {
        super( workLogRecurrenceSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    close(): void {
        this.dialogRef.close();
    }

    protected override buildForm(): FormGroupTyped<any> {
        const fields: FormFields<UpdateWorkLogRecurrenceDto> = {
            minutesLogged: [ this.data.workLogRecurrence?.minutesLogged ?? null, Validators.required ],
            weekDays     : [ this.data.workLogRecurrence?.weekDays ?? [], Validators.required ]
        };
        return this.formBuilder.nonNullable.group<any>( fields );
    }

    protected override onSubmit(): void | Promise<void> {
        this.workLogRecurrenceActions.updateWorkLogRecurrence(
            this.data.workLogRecurrence!.id,
            {
                ...this.form.getRawValue(),
                minutesLogged: timeStringToMinutes( this.form.value.minutesLogged!.toString() )!
            } );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage | Promise<SuccessfulSubmissionMessage> | void | Promise<void> {
        this.close();
        return WorkLogRecurrenceOperationMessage.Updated;
    }
}
