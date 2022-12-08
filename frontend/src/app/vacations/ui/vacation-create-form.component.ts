import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VacationTypeEnum } from '@dtos/vacation-type-enum';
import { ClosedDateInterval, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { VacationCreateFormModalData } from '@vacations/config/vacation.interfaces';
import { vacationTypesToSelectInputOptions } from '@vacations/config/vacation.mappers';
import { CreateVacationRequest } from '@vacations/config/vacation.types';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-vacation-create-form',
                template       : `
                    <app-form-modal
                        title="Create vacation request"
                        [showActionButtons]="true"
                        [showDeleteButton]="false"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()">
                        <form [formGroup]="form">
                            <app-select-input
                                appInput
                                label="Type"
                                formControlName="type"
                                [options]="vacationTypeOptions"
                                [required]="true"></app-select-input>
                            <app-text-input
                                appInput
                                *ngIf="showReasonInput"
                                label="Reason"
                                formControlName="reason"></app-text-input>
                            <div formGroupName="dateInterval">
                                <mat-form-field appearance="outline">
                                    <mat-label>Select period</mat-label>
                                    <mat-date-range-input [rangePicker]="picker" [required]="true">
                                        <input matStartDate formControlName="fromDate" placeholder="From date">
                                        <input matEndDate formControlName="toDate" placeholder="To date">
                                    </mat-date-range-input>
                                    <mat-hint>DD.MM.YYYY – DD.MM.YYYY | Double-click on a date to select only one day</mat-hint>
                                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                                    <mat-date-range-picker #picker></mat-date-range-picker>
                                </mat-form-field>
                            </div>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    CommonModule,
                    ReactiveFormsModule,
                    FormModalComponent,
                    SelectInputComponent,
                    InputModule,
                    TextInputComponent,
                    MatFormFieldModule,
                    MatDatepickerModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class VacationCreateFormComponent extends AbstractForm<CreateVacationRequest> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<CreateVacationRequest>;
    override initialValues = null;
    vacationTypeOptions = vacationTypesToSelectInputOptions();
    showReasonInput = false;

    constructor(@Inject( MAT_DIALOG_DATA ) public readonly data: VacationCreateFormModalData) {
        super( { loadingSrc$: data.loading$ } );
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
        this.manageReasonInput();
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    manageReasonInput(): void {
        this.form.valueChanges
            .pipe( takeUntilDestroy( this ) )
            .subscribe( data => {
                this.showReasonInput = data.type === VacationTypeEnum.UnpaidLeave;
            } );
    }

    protected override formFields(): FormFields<CreateVacationRequest> {
        const dateIntervalFields: FormFields<ClosedDateInterval> = {
            fromDate: [ '', Validators.required ],
            toDate  : [ '', Validators.required ]
        };
        return {
            type        : [ VacationTypeEnum.AnnualLeave, Validators.required ],
            reason      : [ '' ],
            dateInterval: this.fb.nonNullable.group<ClosedDateInterval>( dateIntervalFields )
        };
    }
}
