import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginWithCredentialsDto } from '@dtos/login-with-credentials-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { ButtonModule } from '@shared/ui/button/button.module';
import { PrimaryButtonComponent } from '@shared/ui/button/primary-button.component';
import { InputModule } from '@shared/ui/input/input.module';
import { PasswordInputComponent } from '@shared/ui/input/password-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-login-form',
                template       : `
                    <form [formGroup]="form" (ngSubmit)="submit()">
                        <app-text-input
                            appInput
                            formControlName="emailOrUsername"
                            label="Email or username"
                            [required]="true"></app-text-input>
                        <app-password-input
                            appInput
                            formControlName="password"
                            label="Password"
                            [required]="true"></app-password-input>
                        <app-primary-button
                            appButton
                            label="Login"
                            [disabled]="loading"
                            [fullWidth]="true"></app-primary-button>
                    </form>
                `,
                imports        : [
                    CommonModule,
                    ReactiveFormsModule,
                    TextInputComponent,
                    PasswordInputComponent,
                    ButtonModule,
                    PrimaryButtonComponent,
                    InputModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class LoginFormComponent extends AbstractForm<LoginWithCredentialsDto> implements OnInit {
    @Input()
    override loading!: boolean;

    @Output()
    override onSubmit = new EventEmitter<LoginWithCredentialsDto>();

    override initialValues = null;

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.init();
    }

    protected override formFields(): FormFields<LoginWithCredentialsDto> {
        return {
            emailOrUsername: [ '', Validators.required ],
            password       : [ '', Validators.required ]
        };
    }
}
