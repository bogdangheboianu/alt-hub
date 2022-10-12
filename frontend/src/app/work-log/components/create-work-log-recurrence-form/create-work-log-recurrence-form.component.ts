import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence.dto';
import { ProjectStatusGroupEnum } from '@dtos/project-status-group.enum';
import { ProjectDto } from '@dtos/project.dto';
import { projectsToSelectInputOptions } from '@project/mappers/project.mappers';
import { ProjectActions } from '@project/store/project.actions';
import { ProjectSelectors } from '@project/store/project.selectors';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { timeStringToMinutes } from '@shared/functions/duration.functions';
import { SelectInputOptions } from '@shared/interfaces/select-input-option.interface';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { DEFAULT_WORK_LOG_MINUTES_LOGGED, DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE } from '@work-log/config/work-log.constants';
import { WorkLogRecurrenceOperationMessage } from '@work-log/constants/work-log-recurrence-operation-message.enum';
import { IWorkLogRecurrenceDialogData } from '@work-log/interfaces/work-log-recurrence-dialog-data.interface';
import { WorkLogRecurrenceActions } from '@work-log/store/work-log-recurrence/work-log-recurrence.actions';
import { WorkLogRecurrenceSelectors } from '@work-log/store/work-log-recurrence/work-log-recurrence.selectors';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { map } from 'rxjs';

@Component( {
                selector   : 'app-create-work-log-recurrence-form',
                templateUrl: './create-work-log-recurrence-form.component.html',
                styleUrls  : [ './create-work-log-recurrence-form.component.scss' ]
            } )
@UntilDestroy()
export class CreateWorkLogRecurrenceFormComponent extends BaseForm<CreateWorkLogRecurrenceDto> implements OnInit {
    form!: FormGroupTyped<CreateWorkLogRecurrenceDto>;
    projectOptions: SelectInputOptions = [];

    constructor(
        @Inject( MAT_DIALOG_DATA ) public data: IWorkLogRecurrenceDialogData,
        public dialogRef: MatDialogRef<CreateWorkLogRecurrenceFormComponent>,
        private formBuilder: FormBuilder,
        private projectActions: ProjectActions,
        private projectSelectors: ProjectSelectors,
        private workLogRecurrenceActions: WorkLogRecurrenceActions,
        private workLogRecurrenceSelectors: WorkLogRecurrenceSelectors
    ) {
        super( workLogRecurrenceSelectors );
    }

    override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.loadProjectOptions();
        this.form = await this.buildForm();
    }

    projectOptionDisplay(project: ProjectDto): string {
        return project?.info?.name ?? '';
    }

    close(): void {
        this.dialogRef.close();
    }

    protected override buildForm(): FormGroupTyped<any> {
        const fields: FormFields<CreateWorkLogRecurrenceDto> = {
            minutesLogged: [ DEFAULT_WORK_LOG_MINUTES_LOGGED, Validators.required ],
            projectId    : [ '', Validators.required ],
            weekDays     : [ DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE, Validators.required ]
        };
        return this.formBuilder.nonNullable.group<any>( fields );
    }

    protected override onSubmit(): void {
        this.workLogRecurrenceActions.createWorkLogRecurrence(
            {
                ...this.form.getRawValue(),
                minutesLogged: timeStringToMinutes( this.form.value.minutesLogged!.toString() )!
            } );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage {
        this.close();
        return WorkLogRecurrenceOperationMessage.Created;
    }

    private loadProjectOptions(): void {
        this.projectActions.loadAllProjects( { statusGroup: ProjectStatusGroupEnum.Ongoing } );
        this.projectSelectors.selectAll()
            .pipe(
                takeUntilDestroy( this ),
                map( projectsToSelectInputOptions )
            )
            .subscribe( options => this.projectOptions = options );
    }
}
