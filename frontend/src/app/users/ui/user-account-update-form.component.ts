import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountDto } from '@dtos/account-dto';
import { UpdateAccountDto } from '@dtos/update-account-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { CheckboxInputComponent } from '@shared/ui/input/checkbox-input.component';
import { DateInputComponent } from '@shared/ui/input/date-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { Changes, takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-user-account-update-form',
                template       : `
                    <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
                        <app-text-input appInput
                                        formControlName="email"
                                        label="Email"
                                        [required]="true"
                                        [showInputView]="true"></app-text-input>
                        <app-text-input appInput
                                        formControlName="username"
                                        label="Username"
                                        [required]="true"
                                        [showInputView]="true"></app-text-input>
                        <app-text-input appInput
                                        formControlName="status"
                                        label="Status"
                                        [required]="true"
                                        [showInputView]="true"></app-text-input>
                        <app-date-input appInput
                                        formControlName="lastLoginAt"
                                        label="Last login"
                                        [required]="true"
                                        [showInputView]="true"></app-date-input>
                        <app-checkbox-input appInput
                                            formControlName="isAdmin"
                                            label="Admin account"
                                            [required]="true"
                                            [showInputView]="true"></app-checkbox-input>
                    </form>
                `,
                imports        : [
                    ReactiveFormsModule,
                    NgIf,
                    TextInputComponent,
                    InputModule,
                    CheckboxInputComponent,
                    DateInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserAccountUpdateFormComponent extends AbstractForm<UpdateAccountDto, AccountDto> implements OnInit, OnChanges {
    @Input()
    initialValues!: AccountDto;

    @Changes( 'initialValues' )
    initialValuesChanges!: Observable<AccountDto>;

    @Input()
    loading!: boolean;

    @Output()
    onSubmit = new EventEmitter<UpdateAccountDto>();

    @Input()
    override readonly!: boolean;

    constructor() {
        super( { showInputViews: true } );
    }

    ngOnInit(): void {
        this.init();
        this.initialValuesChanges
            .pipe( takeUntilDestroy( this ) )
            .subscribe( () => this.form.patchValue( this.initialValues ) );
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    protected override formFields(): FormFields<UpdateAccountDto> {
        return {
            email      : [ { value: this.initialValues.email, disabled: true }, [ Validators.required, Validators.email ] ],
            username   : [ { value: this.initialValues.username, disabled: true }, Validators.required ],
            status     : [ { value: this.initialValues.status, disabled: true }, Validators.required ],
            lastLoginAt: [ { value: this.initialValues.lastLoginAt, disabled: true }, Validators.required ],
            isAdmin    : [ { value: this.initialValues.isAdmin, disabled: true }, Validators.required ]
        };
    }
}
