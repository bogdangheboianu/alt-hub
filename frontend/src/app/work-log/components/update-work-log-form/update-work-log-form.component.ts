import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isDefined } from '@datorama/akita';
import { ProjectStatusGroupEnum } from '@dtos/project-status-group.enum';
import { UpdateWorkLogDto } from '@dtos/update-work-log.dto';
import { projectsToSelectInputOptions } from '@project/mappers/project.mappers';
import { ProjectActions } from '@project/store/project.actions';
import { ProjectSelectors } from '@project/store/project.selectors';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { timeStringToMinutes } from '@shared/functions/duration.functions';
import { SelectInputOptions } from '@shared/interfaces/select-input-option.interface';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { WorkLogOperationMessage } from '@work-log/constants/work-log-operation-message.enum';
import { IWorkLogDialogData } from '@work-log/interfaces/work-log-dialog-data.interface';
import { WorkLogUiEvents } from '@work-log/store/work-log/work-log-ui.events';
import { WorkLogActions } from '@work-log/store/work-log/work-log.actions';
import { WorkLogSelectors } from '@work-log/store/work-log/work-log.selectors';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { map } from 'rxjs';

@Component( {
                selector   : 'app-update-work-log-form',
                templateUrl: './update-work-log-form.component.html',
                styleUrls  : [ './update-work-log-form.component.scss' ]
            } )
@UntilDestroy()
export class UpdateWorkLogFormComponent extends BaseForm<UpdateWorkLogDto> implements OnInit {
    form!: FormGroupTyped<UpdateWorkLogDto>;
    projectOptions!: SelectInputOptions;

    constructor(
        @Inject( MAT_DIALOG_DATA ) public data: IWorkLogDialogData,
        public dialogRef: MatDialogRef<UpdateWorkLogFormComponent>,
        private formBuilder: FormBuilder,
        private projectActions: ProjectActions,
        private projectSelectors: ProjectSelectors,
        private workLogSelectors: WorkLogSelectors,
        private workLogActions: WorkLogActions,
        private workLogUiEvents: WorkLogUiEvents
    ) {
        super( workLogSelectors );
    }

    get maxWorkLogDate(): Date {
        return new Date();
    }

    override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.workLogUiEvents.onUpdateWorkLogFormOpened();
        this.loadProjectOptions();
        this.form = await this.buildForm();
    }

    close(): void {
        this.dialogRef.close();
    }

    protected override buildForm(): FormGroupTyped<UpdateWorkLogDto> {
        const initialValues = this.data.workLog;

        if( !isDefined( initialValues ) ) {
            throw new Error( 'Work log is not defined' );
        }

        const fields: FormFields<UpdateWorkLogDto> = {
            description  : [ initialValues?.description ?? '' ],
            minutesLogged: [ initialValues!.minutesLogged, Validators.required ],
            projectId    : [ initialValues!.project.id, Validators.required ],
            date         : [ initialValues!.date, Validators.required ]
        };

        return this.formBuilder.nonNullable.group<UpdateWorkLogDto>( fields );
    }

    protected override onSubmit(): void {
        this.workLogActions.updateWorkLog(
            this.data.workLog!.id,
            {
                ...this.form.getRawValue(),
                minutesLogged: timeStringToMinutes( this.form.value.minutesLogged!.toString() )!
            }
        );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage {
        this.close();
        return WorkLogOperationMessage.Updated;
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
