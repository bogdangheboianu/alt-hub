import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectDto } from '@dtos/create-project-dto';
import { CreateProjectInfoDto } from '@dtos/create-project-info-dto';
import { CreateProjectPricingDto } from '@dtos/create-project-pricing-dto';
import { CreateProjectTimelineDto } from '@dtos/create-project-timeline-dto';
import { CurrencyEnum } from '@dtos/currency-enum';
import { MoneyDto } from '@dtos/money-dto';
import { ProjectPricingDtoTypeEnum } from '@dtos/project-pricing-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { ButtonModule } from '@shared/ui/button/button.module';
import { SaveButtonComponent } from '@shared/ui/button/save-button.component';
import { DateInputComponent } from '@shared/ui/input/date-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { NumberInputComponent } from '@shared/ui/input/number-input.component';
import { SelectInputComponent, SelectInputOptions } from '@shared/ui/input/select-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { TextareaInputComponent } from '@shared/ui/input/textarea-input.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';

@Component( {
                standalone     : true,
                selector       : 'app-project-create-form',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
                        <div class="row">
                            <div formGroupName="info" class="col-6">
                                <app-section-title title="Info"></app-section-title>
                                <app-text-input
                                    appInput
                                    formControlName="name"
                                    label="Name"
                                    [required]="true"></app-text-input>
                                <app-select-input appInput
                                                  formControlName="clientId"
                                                  label="Beneficiary"
                                                  [options]="clientOptions"></app-select-input>
                                <app-textarea-input appInput
                                                    formControlName="description"
                                                    label="Description"></app-textarea-input>
                            </div>
                            <div formGroupName="timeline" class="col-6">
                                <app-section-title title="Timeline"></app-section-title>
                                <app-date-input appInput
                                                label="Start date"
                                                formControlName="startDate"></app-date-input>
                                <app-date-input appInput
                                                label="End date"
                                                formControlName="endDate"></app-date-input>
                                <app-date-input appInput
                                                label="Deadline"
                                                formControlName="deadline"></app-date-input>
                            </div>
                            <div formGroupName="pricing" class="col-6">
                                <app-section-title title="Pricing"></app-section-title>
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
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <app-save-button appButton [disabled]="loading"></app-save-button>
                        </div>
                    </form>
                `,
                imports        : [
                    CommonModule,
                    ReactiveFormsModule,
                    TextInputComponent,
                    SelectInputComponent,
                    InputModule,
                    TextareaInputComponent,
                    DateInputComponent,
                    SectionTitleComponent,
                    SaveButtonComponent,
                    LoadingBarComponent,
                    ButtonModule,
                    SharedPipesModule,
                    NumberInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ProjectCreateFormComponent extends AbstractForm<CreateProjectDto> implements OnInit {
    @Input()
    override loading!: boolean;

    @Input()
    clientOptions!: SelectInputOptions;

    @Input()
    set clientOptionsLoading(value: boolean) {
        const clientInput = this.form?.controls.info.get( 'clientId' );
        value
        ? clientInput?.disable()
        : clientInput?.enable();
    }

    @Output()
    override onSubmit = new EventEmitter<CreateProjectDto>();

    override initialValues = null;
    projectPricingTypeEnum = ProjectPricingDtoTypeEnum;
    selectedProjectPricingType?: ProjectPricingDtoTypeEnum;

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.init();
    }

    onProjectPricingTypeChange(type: string): void {
        this.selectedProjectPricingType = type as ProjectPricingDtoTypeEnum;
    }

    protected override formFields(): FormFields<CreateProjectDto> {
        const infoFormFields: FormFields<CreateProjectInfoDto> = {
            name       : [ '', Validators.required ],
            clientId   : [ { value: '', disabled: true } ],
            description: [ '' ]
        };
        const timelineFormFields: FormFields<CreateProjectTimelineDto> = {
            startDate: [ null ],
            endDate  : [ null ],
            deadline : [ null ]
        };
        const hourlyRateFields: FormFields<MoneyDto> = {
            amount  : [ null ],
            currency: [ CurrencyEnum.Eur ]
        };
        const fixedPriceFields: FormFields<MoneyDto> = {
            amount  : [ null ],
            currency: [ CurrencyEnum.Eur ]
        };
        const pricingFormFields: FormFields<CreateProjectPricingDto> = {
            type      : [ null ],
            hourlyRate: this.fb.nonNullable.group<MoneyDto>( hourlyRateFields ),
            fixedPrice: this.fb.nonNullable.group<MoneyDto>( fixedPriceFields )
        };

        return {
            info    : this.fb.nonNullable.group<CreateProjectInfoDto>( infoFormFields ),
            timeline: this.fb.nonNullable.group<CreateProjectTimelineDto>( timelineFormFields ),
            pricing : this.fb.nonNullable.group<CreateProjectPricingDto>( pricingFormFields )
        };
    }
}
