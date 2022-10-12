import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm } from '@shared/directives/base-form.directive';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { ICreateUserAccount } from '@user/interfaces/create-user-account.interface';
import { UserSelectors } from '@user/store/user.selectors';
import { UserStore } from '@user/store/user.store';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-create-user-account-form',
                templateUrl: './create-user-account-form.component.html',
                styleUrls  : [ './create-user-account-form.component.scss' ]
            } )
@UntilDestroy()
export class CreateUserAccountFormComponent extends BaseForm<ICreateUserAccount> implements OnInit {
    form!: FormGroupTyped<ICreateUserAccount>;

    constructor(
        private formBuilder: FormBuilder,
        private userStore: UserStore,
        private userSelectors: UserSelectors
    ) {
        super( userSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    protected buildForm(): FormGroupTyped<ICreateUserAccount> {
        const fields: FormFields<ICreateUserAccount> = {
            email   : [ this.initialValues?.email ?? '', [ Validators.required, Validators.email ] ],
            password: [ this.initialValues?.password ?? '', Validators.required ],
            isAdmin : [ this.initialValues?.isAdmin ?? false, Validators.required ]
        };
        return this.formBuilder.nonNullable.group<ICreateUserAccount>( fields );
    }

    protected override onSubmit(): void {
        this.userStore.setNewUserAccount( this.form.getRawValue() );
    }
}
