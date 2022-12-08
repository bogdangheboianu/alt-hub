import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyPricingProfileCreateFormModalData } from '@company/config/company.interfaces';
import { CreateCompanyPricingProfileDto } from '@dtos/create-company-pricing-profile-dto';
import { CurrencyEnum } from '@dtos/currency-enum';
import { MoneyDto } from '@dtos/money-dto';
import { ComponentInstance, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { NumberInputComponent } from '@shared/ui/input/number-input.component';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-company-pricing-profile-create-form',
                template       : `
                    <app-form-modal
                        title="Create pricing profile"
                        [loading]="loading"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()">
                        <form [formGroup]="form">
                            <app-select-input
                                appInput
                                label="Position"
                                formControlName="positionId"
                                [options]="(data.companyPositions$ | async)!"
                                [required]="true"></app-select-input>
                            <app-text-input
                                appInput
                                label="Name"
                                formControlName="name"
                                [required]="true"></app-text-input>
                            <ng-container formGroupName="hourlyRate">
                                <app-number-input
                                    appInput
                                    label="Hourly rate"
                                    formControlName="amount"
                                    hint="Eur/hr"
                                    [required]="true"></app-number-input>
                            </ng-container>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    FormModalComponent,
                    ReactiveFormsModule,
                    TextInputComponent,
                    InputModule,
                    SelectInputComponent,
                    AsyncPipe,
                    NumberInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class CompanyPricingProfileCreateFormComponent extends AbstractForm<CreateCompanyPricingProfileDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<CreateCompanyPricingProfileDto>;
    override initialValues = null;

    constructor(@Inject( MAT_DIALOG_DATA ) public readonly data: CompanyPricingProfileCreateFormModalData) {
        super( { loadingSrc$: data.loading$ } );
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
        this.handleCompanyPositionSelectInputState( this.data.companyPositionsLoading$ );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<CreateCompanyPricingProfileDto> {
        const hourlyRateFields: FormFields<MoneyDto> = {
            amount  : [ null, Validators.required ],
            currency: [ CurrencyEnum.Eur, Validators.required ]
        };
        return {
            name        : [ null, Validators.required ],
            positionId  : [ { value: null, disabled: true }, Validators.required ],
            positionName: [ { value: null, disabled: true } ],
            hourlyRate  : this.fb.nonNullable.group<MoneyDto>( hourlyRateFields )
        };
    }

    protected override componentInstance(): ComponentInstance | null {
        return this;
    }

    private handleCompanyPositionSelectInputState(loading$: Observable<boolean>): void {
        loading$.pipe( takeUntilDestroy( this ) )
                .subscribe( isLoading => {
                    const input = this.form.controls.positionId!;
                    isLoading
                    ? input.disable()
                    : input.enable();
                } );
    }
}
