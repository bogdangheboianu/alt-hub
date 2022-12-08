import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalInfoDto } from '@dtos/personal-info-dto';
import { UpdateUserPersonalInfoDto } from '@dtos/update-user-personal-info-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { ButtonModule } from '@shared/ui/button/button.module';
import { CancelButtonComponent } from '@shared/ui/button/cancel-button.component';
import { SaveButtonComponent } from '@shared/ui/button/save-button.component';
import { DateInputComponent } from '@shared/ui/input/date-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { Changes, takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-user-personal-info-update-form',
                template       : `
                    <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
                        <app-text-input appInput
                                        label="First name"
                                        formControlName="firstName"
                                        [required]="true"
                                        [showInputView]="showInputViews"
                                        (onInputViewClick)="hideInputViews()"></app-text-input>
                        <app-text-input appInput
                                        label="Last name"
                                        formControlName="lastName"
                                        [required]="true"
                                        [showInputView]="showInputViews"
                                        (onInputViewClick)="hideInputViews()"></app-text-input>
                        <app-date-input appInput
                                        label="Date of birth"
                                        formControlName="dateOfBirth"
                                        [required]="true"
                                        [showInputView]="showInputViews"
                                        (onInputViewClick)="hideInputViews()"></app-date-input>
                        <app-text-input appInput
                                        label="CNP"
                                        formControlName="ssn"
                                        [required]="true"
                                        [showInputView]="showInputViews"
                                        (onInputViewClick)="hideInputViews()"></app-text-input>
                        <app-text-input appInput
                                        label="Address"
                                        formControlName="address"
                                        [required]="true"
                                        [showInputView]="showInputViews"
                                        (onInputViewClick)="hideInputViews()"></app-text-input>
                        <app-text-input appInput
                                        label="Phone number"
                                        formControlName="phone"
                                        [required]="true"
                                        [showInputView]="showInputViews"
                                        (onInputViewClick)="hideInputViews()"></app-text-input>
                        <div class="w-100 row m-0 p-0">
                            <div class="col-4 p-0">
                                <app-cancel-button appButton
                                                   *ngIf="!showInputViews"
                                                   (onClick)="cancel()"></app-cancel-button>
                            </div>
                            <div class="col-8 p-0">
                                <app-save-button appButton
                                                 *ngIf="form.dirty && !showInputViews"
                                                 [fullWidth]="true"
                                                 [disabled]="form.invalid"></app-save-button>
                            </div>
                        </div>
                    </form>
                `,
                imports        : [
                    NgIf,
                    ReactiveFormsModule,
                    CancelButtonComponent,
                    ButtonModule,
                    SaveButtonComponent,
                    TextInputComponent,
                    DateInputComponent,
                    InputModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserPersonalInfoUpdateFormComponent extends AbstractForm<UpdateUserPersonalInfoDto, PersonalInfoDto> implements OnInit, OnChanges {
    @Input()
    initialValues!: PersonalInfoDto;

    @Changes( 'initialValues' )
    initialValuesChanges!: Observable<PersonalInfoDto>;

    @Input()
    loading!: boolean;

    @Input()
    override readonly!: boolean;

    @Output()
    onSubmit = new EventEmitter<UpdateUserPersonalInfoDto>();

    constructor() {
        super( { showInputViews: true } );
    }

    ngOnInit(): void {
        this.init();
        this.initialValuesChanges
            .pipe( takeUntilDestroy( this ) )
            .subscribe( () => this.setForm() );
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    protected override formFields(): FormFields<UpdateUserPersonalInfoDto> {
        return {
            firstName  : [ this.initialValues?.firstName, Validators.required ],
            lastName   : [ this.initialValues?.lastName, Validators.required ],
            dateOfBirth: [ this.initialValues?.dateOfBirth, Validators.required ],
            ssn        : [ this.initialValues?.ssn, Validators.required ],
            phone      : [ this.initialValues?.phone, Validators.required ],
            address    : [ this.initialValues?.address, Validators.required ]
        };
    }
}
