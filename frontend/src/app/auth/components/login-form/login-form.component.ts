import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthActions } from '@auth/store/auth.actions';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { AppR } from '@shared/constants/routes';
import { LoginWithCredentialsDto } from '@dtos/login-with-credentials.dto';
import { BaseForm } from '@shared/directives/base-form.directive';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';

@Component( {
                selector   : 'app-login-form',
                templateUrl: './login-form.component.html',
                styleUrls  : [ './login-form.component.scss' ]
            } )
export class LoginFormComponent extends BaseForm<LoginWithCredentialsDto> implements OnInit {
    form!: FormGroupTyped<LoginWithCredentialsDto>;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authActions: AuthActions,
        private readonly authSelectors: AuthSelectors,
        private readonly router: Router
    ) {
        super( authSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    protected override buildForm(): FormGroupTyped<LoginWithCredentialsDto> {
        const fields: FormFields<LoginWithCredentialsDto> = {
            emailOrUsername: [ '', Validators.required ],
            password       : [ '', Validators.required ]
        };
        return this.formBuilder.nonNullable.group<LoginWithCredentialsDto>( fields );
    }

    protected override onSubmit(): void {
        this.authActions.login( this.form.getRawValue() );
    }

    protected override async onSuccessfulSubmission(): Promise<void> {
        await this.router.navigateByUrl( AppR.dashboard.full );
    }
}
