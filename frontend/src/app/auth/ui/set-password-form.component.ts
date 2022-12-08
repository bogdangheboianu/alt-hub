import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordsMatchValidator } from '@auth/config/auth.validators';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { ButtonModule } from '@shared/ui/button/button.module';
import { PrimaryButtonComponent } from '@shared/ui/button/primary-button.component';
import { InputModule } from '@shared/ui/input/input.module';
import { PasswordInputComponent } from '@shared/ui/input/password-input.component';

export interface SetPassword {
    password1: string;
    password2: string;
}

@Component( {
                standalone     : true,
                selector       : 'app-set-password-form',
                template       : `
                    <form [formGroup]="form" (ngSubmit)="submit()">
                        <app-password-input appInput
                                            formControlName="password1"
                                            label="Set password"
                                            [required]="true"></app-password-input>
                        <app-password-input appInput
                                            formControlName="password2"
                                            label="Confirm password"
                                            [required]="true"></app-password-input>
                        <app-primary-button appButton label="Confirm account" [disabled]="loading" [fullWidth]="true"></app-primary-button>
                    </form>
                `,
                imports        : [
                    ReactiveFormsModule,
                    PasswordInputComponent,
                    InputModule,
                    PrimaryButtonComponent,
                    ButtonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SetPasswordFormComponent extends AbstractForm<SetPassword> implements OnInit {
    @Input()
    override loading!: boolean;

    @Output()
    override onSubmit = new EventEmitter<SetPassword>();

    override initialValues = null;

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.init( [ PasswordsMatchValidator ] );
    }

    protected override formFields(): FormFields<SetPassword> {
        return {
            password1: [ '', Validators.required ],
            password2: [ '', Validators.required ]
        };
    }
}
