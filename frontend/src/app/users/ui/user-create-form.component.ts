import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAccountDto } from '@dtos/create-account-dto';
import { CreateEmploymentInfoDto } from '@dtos/create-employment-info-dto';
import { CreatePersonalInfoDto } from '@dtos/create-personal-info-dto';
import { CreateUserDto } from '@dtos/create-user-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { ButtonModule } from '@shared/ui/button/button.module';
import { SaveButtonComponent } from '@shared/ui/button/save-button.component';
import { CheckboxInputComponent } from '@shared/ui/input/checkbox-input.component';
import { DateInputComponent } from '@shared/ui/input/date-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { NumberInputComponent } from '@shared/ui/input/number-input.component';
import { PasswordInputComponent } from '@shared/ui/input/password-input.component';
import { SelectInputComponent, SelectInputOptions } from '@shared/ui/input/select-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';

@Component( {
                standalone     : true,
                selector       : 'app-user-create-form',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
                        <div class="row">
                            <div class="col-6">
                                <div formGroupName="account" class="mb-4">
                                    <app-section-title title="Account"></app-section-title>
                                    <app-text-input appInput
                                                    formControlName="email"
                                                    label="Email"
                                                    [required]="true"></app-text-input>
                                    <app-password-input appInput
                                                        formControlName="password"
                                                        label="Create password"
                                                        [required]="true"></app-password-input>
                                    <app-checkbox-input appInput
                                                        formControlName="isAdmin"
                                                        label="Admin account"
                                                        [required]="true"></app-checkbox-input>
                                </div>
                                <div formGroupName="employmentInfo">
                                    <app-section-title title="Employment info"></app-section-title>
                                    <app-select-input appInput
                                                      label="Company position"
                                                      formControlName="companyPositionId"
                                                      [options]="companyPositionOptions"
                                                      [required]="true"></app-select-input>
                                    <app-date-input appInput
                                                    label="Hire date"
                                                    formControlName="hiredOn"
                                                    [required]="true"></app-date-input>
                                    <app-number-input appInput
                                                      label="Paid leave days"
                                                      formControlName="paidLeaveDays"
                                                      [required]="true"></app-number-input>
                                </div>
                            </div>
                            <div formGroupName="personalInfo" class="col-6">
                                <app-section-title title="Personal info"></app-section-title>
                                <app-text-input appInput
                                                label="First name"
                                                formControlName="firstName"
                                                [required]="true"></app-text-input>
                                <app-text-input appInput
                                                label="Last name"
                                                formControlName="lastName"
                                                [required]="true"></app-text-input>
                                <app-date-input appInput
                                                label="Date of birth"
                                                formControlName="dateOfBirth"
                                                [required]="true"></app-date-input>
                                <app-text-input appInput
                                                label="CNP"
                                                formControlName="ssn"
                                                [required]="true"></app-text-input>
                                <app-text-input appInput
                                                label="Address"
                                                formControlName="address"
                                                [required]="true"></app-text-input>
                                <app-text-input appInput
                                                label="Phone number"
                                                formControlName="phone"
                                                [required]="true"></app-text-input>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <app-save-button appButton [disabled]="loading"></app-save-button>
                        </div>
                    </form>
                `,
                imports        : [
                    ReactiveFormsModule,
                    LoadingBarComponent,
                    NgIf,
                    SectionTitleComponent,
                    SaveButtonComponent,
                    ButtonModule,
                    TextInputComponent,
                    InputModule,
                    PasswordInputComponent,
                    CheckboxInputComponent,
                    DateInputComponent,
                    SelectInputComponent,
                    NumberInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class UserCreateFormComponent extends AbstractForm<CreateUserDto> implements OnInit {
    @Input()
    override loading!: boolean;

    @Input()
    companyPositionOptions!: SelectInputOptions;

    @Input()
    set companyPositionOptionsLoading(value: boolean) {
        const companyPositionInput = this.form?.controls.employmentInfo.get( 'companyPositionId' );
        value
        ? companyPositionInput?.disable()
        : companyPositionInput?.enable();
    }

    @Output()
    override onSubmit = new EventEmitter<CreateUserDto>();

    override initialValues = null;

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.init();
    }

    protected override formFields(): FormFields<CreateUserDto> {
        const accountFields: FormFields<CreateAccountDto> = {
            email   : [ '', [ Validators.required, Validators.email ] ],
            password: [ '', Validators.required ],
            isAdmin : [ false, Validators.required ]
        };
        const personalInfoFields: FormFields<CreatePersonalInfoDto> = {
            firstName  : [ '', Validators.required ],
            lastName   : [ '', Validators.required ],
            dateOfBirth: [ null, Validators.required ],
            ssn        : [ '', Validators.required ],
            phone      : [ '', Validators.required ],
            address    : [ '', Validators.required ]
        };
        const employmentInfoFields: FormFields<CreateEmploymentInfoDto> = {
            companyPositionId: [ { value: '', disabled: true }, Validators.required ],
            hiredOn          : [ null, Validators.required ],
            paidLeaveDays    : [ null, Validators.required ]
        };

        return {
            account       : this.fb.nonNullable.group<CreateAccountDto>( accountFields ),
            personalInfo  : this.fb.nonNullable.group<CreatePersonalInfoDto>( personalInfoFields ),
            employmentInfo: this.fb.nonNullable.group<CreateEmploymentInfoDto>( employmentInfoFields )
        };
    }
}
