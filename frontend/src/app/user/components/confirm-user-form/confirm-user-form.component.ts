import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppR } from '@shared/constants/routes';
import { BaseForm } from '@shared/directives/base-form.directive';
import { getQueryParamFromRoute } from '@shared/functions/get-from-route.function';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { ISetPassword } from '@user/interfaces/set-password.interface';
import { UserActions } from '@user/store/user.actions';
import { UserSelectors } from '@user/store/user.selectors';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-confirm-user-form',
                templateUrl: './confirm-user-form.component.html',
                styleUrls  : [ './confirm-user-form.component.scss' ]
            } )
@UntilDestroy()
export class ConfirmUserFormComponent extends BaseForm<ISetPassword> implements OnInit {
    form!: FormGroupTyped<ISetPassword>;

    constructor(
        private userSelectors: UserSelectors,
        private userActions: UserActions,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {
        super( userSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    protected buildForm(): FormGroupTyped<ISetPassword> {
        const fields: FormFields<ISetPassword> = {
            password1: [ '', Validators.required ],
            password2: [ '', Validators.required ]
        };
        return this.formBuilder.nonNullable.group<ISetPassword>( fields );
    }

    protected override onSubmit(): void {
        getQueryParamFromRoute( 'token', this.route )
            .pipe( takeUntilDestroy( this ) )
            .subscribe( this.confirmUser.bind( this ) );
    }

    protected override async onSuccessfulSubmission(): Promise<void> {
        await this.router.navigateByUrl( AppR.auth.login.full );
    }

    private confirmUser(token: string): void {
        const { password1, password2 } = this.form.getRawValue();

        if( password1 !== password2 ) {
            return;
        }

        this.userActions.confirmUser( { token, newPassword: password1 } );
    }
}
