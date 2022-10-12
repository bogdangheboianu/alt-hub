import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateWorkLogDto } from '@dtos/create-work-log.dto';
import { ProjectStatusGroupEnum } from '@dtos/project-status-group.enum';
import { ProjectDto } from '@dtos/project.dto';
import { projectsToSelectInputOptions } from '@project/mappers/project.mappers';
import { ProjectActions } from '@project/store/project.actions';
import { ProjectSelectors } from '@project/store/project.selectors';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { timeStringToMinutes } from '@shared/functions/duration.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { SelectInputOptions } from '@shared/interfaces/select-input-option.interface';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { DEFAULT_WORK_LOG_MINUTES_LOGGED, DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE } from '@work-log/config/work-log.constants';
import { WorkLogOperationMessage } from '@work-log/constants/work-log-operation-message.enum';
import { IWorkLogDialogData } from '@work-log/interfaces/work-log-dialog-data.interface';
import { WorkLogUiEvents } from '@work-log/store/work-log/work-log-ui.events';
import { WorkLogActions } from '@work-log/store/work-log/work-log.actions';
import { WorkLogSelectors } from '@work-log/store/work-log/work-log.selectors';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';

@Component( {
                selector   : 'app-create-work-log-form',
                templateUrl: './create-work-log-form.component.html',
                styleUrls  : [ './create-work-log-form.component.scss' ]
            } )
@UntilDestroy()
export class CreateWorkLogFormComponent extends BaseForm<CreateWorkLogDto> implements OnInit {
    form!: FormGroupTyped<CreateWorkLogDto>;
    projectOptions: SelectInputOptions = [];
    createRecurrence = new BehaviorSubject( false );

    constructor(
        @Inject( MAT_DIALOG_DATA ) public data: IWorkLogDialogData,
        public dialogRef: MatDialogRef<CreateWorkLogFormComponent>,
        private formBuilder: FormBuilder,
        private projectActions: ProjectActions,
        private projectSelectors: ProjectSelectors,
        private workLogActions: WorkLogActions,
        private workLogSelectors: WorkLogSelectors,
        private workLogUiEvents: WorkLogUiEvents
    ) {
        super( workLogSelectors );
    }

    get maxWorkLogDate(): Date {
        return new Date();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.workLogUiEvents.onCreateWorkLogFormOpened();
        this.loadProjectOptions();
        this.form = this.buildForm();
    }

    projectOptionDisplay(project: ProjectDto): string {
        return project?.info?.name ?? '';
    }

    close(): void {
        this.dialogRef.close();
    }

    createRecurrenceCheckboxChange(event: MatCheckboxChange): void {
        this.createRecurrence.next( event.checked );
    }

    protected override buildForm(): FormGroupTyped<CreateWorkLogDto> {
        const fields: FormFields<CreateWorkLogDto> = {
            description       : [ '' ],
            minutesLogged     : [ DEFAULT_WORK_LOG_MINUTES_LOGGED, Validators.required ],
            date              : [ new Date(), Validators.required ],
            projectId         : [ '', Validators.required ],
            weekDaysRecurrence: [ DEFAULT_WORK_LOG_WEEK_DAYS_RECURRENCE ]
        };
        return this.formBuilder.nonNullable.group<CreateWorkLogDto>( fields );
    }

    protected override async onSubmit(): Promise<void> {
        const { weekDaysRecurrence: wdr } = this.form.value;
        const createRecurrence = await firstValueFrom( this.createRecurrence );
        const weekDaysRecurrence = valueIsEmpty( wdr ) || !createRecurrence
                                   ? undefined
                                   : wdr;
        const minutesLogged = timeStringToMinutes( this.form.value.minutesLogged!.toString() )!;

        this.workLogActions.createWorkLog( { ...this.form.getRawValue(), minutesLogged, weekDaysRecurrence } );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage {
        this.close();
        return WorkLogOperationMessage.Created;
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
