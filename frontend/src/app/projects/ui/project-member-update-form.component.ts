import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectMemberDto } from '@dtos/project-member-dto';
import { UpdateProjectMemberDto } from '@dtos/update-project-member-dto';
import { ProjectMemberUpdateFormModalData } from '@projects/config/project.interfaces';
import { ComponentInstance, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { CheckboxInputComponent } from '@shared/ui/input/checkbox-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { NumberInputComponent } from '@shared/ui/input/number-input.component';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-project-member-update-form',
                template       : `
                    <app-form-modal
                        title="Update project member"
                        [loading]="loading"
                        [showDeleteButton]="true"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()"
                        (onDeleteBtnClick)="delete()">
                        <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
                            <app-select-input
                                appInput
                                label="Employee"
                                formControlName="userId"
                                [options]="(data.userOptions$ | async)!"
                                [required]="true"></app-select-input>
                            <app-select-input
                                appInput
                                label="Pricing profile"
                                formControlName="pricingProfileId"
                                [options]="(data.pricingProfileOptions$ | async)!"
                                [required]="true"></app-select-input>
                            <app-number-input
                                *ngIf="data.showAllocatedHoursInput"
                                appInput
                                label="Allocated hours"
                                formControlName="allocatedHours"></app-number-input>
                            <app-checkbox-input
                                appInput
                                label="Coordinator"
                                formControlName="isCoordinator"
                                [required]="true"></app-checkbox-input>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    LoadingBarComponent,
                    CommonModule,
                    ReactiveFormsModule,
                    SelectInputComponent,
                    InputModule,
                    CheckboxInputComponent,
                    FormModalComponent,
                    NumberInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectMemberUpdateFormComponent extends AbstractForm<UpdateProjectMemberDto, ProjectMemberDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<UpdateProjectMemberDto>;
    override initialValues;

    constructor(@Inject( MAT_DIALOG_DATA ) public readonly data: ProjectMemberUpdateFormModalData) {
        super( { loadingSrc$: data.loading$ } );
        this.onSubmit = data.onSubmit;
        this.initialValues = data.initialValues;
    }

    ngOnInit(): void {
        this.init();
        this.handleUserSelectInputState( this.data.userOptionsLoading$ );
        this.handlePricingProfileSelectInputState( this.data.pricingProfileOptionsLoading$ );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    delete(): void {
        this.data.onDelete();
    }

    protected override formFields(): FormFields<UpdateProjectMemberDto> {
        return {
            pricingProfileId: [ { value: this.initialValues.pricingProfile!.id, disabled: true }, Validators.required ],
            userId          : [ { value: this.initialValues.user.id, disabled: true }, Validators.required ],
            isCoordinator   : [ this.initialValues.isCoordinator, Validators.required ],
            allocatedHours  : [ this.initialValues.allocatedHours ]
        };
    }

    protected override componentInstance(): ComponentInstance | null {
        return this;
    }

    private handleUserSelectInputState(loading$: Observable<boolean>): void {
        loading$.pipe( takeUntilDestroy( this ) )
                .subscribe( isLoading => {
                    const input = this.form.controls.userId!;
                    isLoading
                    ? input.disable()
                    : input.enable();
                } );
    }

    private handlePricingProfileSelectInputState(loading$: Observable<boolean>): void {
        loading$.pipe( takeUntilDestroy( this ) )
                .subscribe( isLoading => {
                    const input = this.form.controls.pricingProfileId!;
                    isLoading
                    ? input.disable()
                    : input.enable();
                } );
    }
}
