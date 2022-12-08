import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectInfoDto } from '@dtos/project-info-dto';
import { UpdateProjectInfoDto } from '@dtos/update-project-info-dto';
import { ProjectInfoUpdateFormModalData } from '@projects/config/project.interfaces';
import { ComponentInstance, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { TextareaInputComponent } from '@shared/ui/input/textarea-input.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-project-info-update-form',
                template       : `
                    <app-form-modal title="Update project info"
                                    [loading]="loading"
                                    (onSaveBtnClick)="submit()"
                                    (onCancelBtnClick)="cancel()">
                        <form [formGroup]="form">
                            <app-text-input appInput
                                            formControlName="name"
                                            label="Name"
                                            [required]="false"></app-text-input>
                            <app-select-input appInput
                                              formControlName="clientId"
                                              label="Beneficiary"
                                              [options]="(data.clientOptions$ | async)!"></app-select-input>
                            <app-textarea-input appInput
                                                formControlName="description"
                                                label="Description"
                                                [required]="false"></app-textarea-input>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    CommonModule,
                    FormModalComponent,
                    ReactiveFormsModule,
                    TextInputComponent,
                    InputModule,
                    SelectInputComponent,
                    TextareaInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectInfoUpdateFormComponent extends AbstractForm<UpdateProjectInfoDto, ProjectInfoDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<UpdateProjectInfoDto>;
    override initialValues: ProjectInfoDto;

    constructor(@Inject( MAT_DIALOG_DATA ) public readonly data: ProjectInfoUpdateFormModalData) {
        super( { loadingSrc$: data.loading$ } );
        this.initialValues = data.initialValues;
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
        this.handleClientSelectInputState( this.data.clientOptionsLoading$ );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<UpdateProjectInfoDto> {
        return {
            name       : [ this.initialValues.name, Validators.required ],
            description: [ this.initialValues.description ],
            clientId   : [ { value: this.initialValues.client ?? '', disabled: true } ]
        };
    }

    protected override componentInstance(): ComponentInstance | null {
        return this;
    }

    private handleClientSelectInputState(loading$: Observable<boolean>): void {
        loading$.pipe( takeUntilDestroy( this ) )
                .subscribe( isLoading => {
                    const input = this.form.controls.clientId;
                    isLoading
                    ? input.disable()
                    : input.enable();
                } );
    }
}
