import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyEnum } from '@dtos/currency-enum';
import { MoneyDto } from '@dtos/money-dto';
import { ProjectPricingDto, ProjectPricingDtoTypeEnum } from '@dtos/project-pricing-dto';
import { UpdateProjectPricingDto } from '@dtos/update-project-pricing-dto';
import { ProjectPricingUpdateFormModalData } from '@projects/config/project.interfaces';
import { FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { NumberInputComponent } from '@shared/ui/input/number-input.component';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-project-pricing-update-form',
                template       : `
                    <app-form-modal title="Update project pricing"
                                    [loading]="loading"
                                    (onSaveBtnClick)="submit()"
                                    (onCancelBtnClick)="cancel()">
                        <form *ngIf="form" [formGroup]="form">
                            <app-select-input appInput
                                              formControlName="type"
                                              label="Pricing type"
                                              [options]="projectPricingTypeEnum | enumToSelectInputOptions"
                                              (onSelect)="onProjectPricingTypeChange($event)"></app-select-input>
                            <ng-container [ngSwitch]="selectedProjectPricingType">
                                <ng-container formGroupName="hourlyRate" *ngSwitchCase="'time_and_material'">
                                    <app-number-input
                                        appInput
                                        label="Hourly rate"
                                        formControlName="amount"
                                        hint="Eur/hr"></app-number-input>
                                </ng-container>
                                <ng-container formGroupName="fixedPrice" *ngSwitchCase="'fixed_price'">
                                    <app-number-input
                                        appInput
                                        label="Fixed price"
                                        formControlName="amount"
                                        hint="Eur"></app-number-input>
                                </ng-container>
                            </ng-container>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    CommonModule,
                    FormModalComponent,
                    ReactiveFormsModule,
                    InputModule,
                    SharedPipesModule,
                    SelectInputComponent,
                    NumberInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectPricingUpdateFormComponent extends AbstractForm<UpdateProjectPricingDto, ProjectPricingDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<UpdateProjectPricingDto>;
    override initialValues: ProjectPricingDto | null;
    projectPricingTypeEnum = ProjectPricingDtoTypeEnum;
    selectedProjectPricingType?: ProjectPricingDtoTypeEnum;

    constructor(@Inject( MAT_DIALOG_DATA ) public data: ProjectPricingUpdateFormModalData) {
        super( { loadingSrc$: data.loading$ } );
        this.initialValues = data.initialValues;
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
        this.selectedProjectPricingType = this.initialValues?.type ?? undefined;
    }

    onProjectPricingTypeChange(type: string): void {
        this.selectedProjectPricingType = type as ProjectPricingDtoTypeEnum;
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<UpdateProjectPricingDto> {
        const hourlyRateFields: FormFields<MoneyDto> = {
            amount  : [ this.initialValues?.hourlyRate.amount ?? null ],
            currency: [ CurrencyEnum.Eur ]
        };
        const fixedPriceFields: FormFields<MoneyDto> = {
            amount  : [ this.initialValues?.fixedPrice.amount ?? null ],
            currency: [ CurrencyEnum.Eur ]
        };
        return {
            type      : [ this.initialValues?.type ?? null ],
            hourlyRate: this.fb.nonNullable.group<MoneyDto>( hourlyRateFields ),
            fixedPrice: this.fb.nonNullable.group<MoneyDto>( fixedPriceFields )
        };
    }
}
