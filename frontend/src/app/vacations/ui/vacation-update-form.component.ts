import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VacationDto } from '@dtos/vacation-dto';
import { VacationTypeEnum } from '@dtos/vacation-type-enum';
import { ClosedDateInterval, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { VacationUpdateFormModalData } from '@vacations/config/vacation.interfaces';
import { UpdateVacationRequest } from '@vacations/config/vacation.types';

@Component( {
                standalone     : true,
                selector       : 'app-vacation-create-form',
                template       : `
                    <app-form-modal
                        title="Update vacation request"
                        [showActionButtons]="true"
                        [showDeleteButton]="true"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()"
                        (onDeleteBtnClick)="data.onDelete()">
                        <form [formGroup]="form">
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
export class VacationUpdateFormComponent extends AbstractForm<UpdateVacationRequest, VacationDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<UpdateVacationRequest>;
    override initialValues: VacationDto;
    showReasonInput: boolean;

    constructor(@Inject( MAT_DIALOG_DATA ) public readonly data: VacationUpdateFormModalData) {
        super( { loadingSrc$: data.loading$ } );
        this.initialValues = data.initialValues;
        this.onSubmit = data.onSubmit;
        this.showReasonInput = data.initialValues.type === VacationTypeEnum.UnpaidLeave;
    }

    ngOnInit(): void {
        this.init();
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<UpdateVacationRequest> {
        const dateIntervalFields: FormFields<ClosedDateInterval> = {
            fromDate: [ this.data.initialValues.fromDate, Validators.required ],
            toDate  : [ this.data.initialValues.toDate, Validators.required ]
        };
        return {
            reason      : [ this.data.initialValues.reason ?? '' ],
            dateInterval: this.fb.nonNullable.group<ClosedDateInterval>( dateIntervalFields )
        };
    }
}
