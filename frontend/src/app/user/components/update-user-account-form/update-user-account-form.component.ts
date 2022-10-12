import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UpdateUserAccountDto } from '@dtos/update-user-account.dto';
import { UserDto } from '@dtos/user.dto';
import { BaseForm } from '@shared/directives/base-form.directive';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { UserSelectors } from '@user/store/user.selectors';

@Component( {
                selector   : 'app-update-user-account-form',
                templateUrl: './update-user-account-form.component.html',
                styleUrls  : [ './update-user-account-form.component.scss' ]
            } )
export class UpdateUserAccountFormComponent extends BaseForm<UpdateUserAccountDto, UserDto> implements OnInit {
    form!: FormGroupTyped<UpdateUserAccountDto>;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly userSelectors: UserSelectors
    ) {
        super( userSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.activateViewMode();
        this.form = this.buildForm();
    }

    protected override buildForm(): FormGroupTyped<UpdateUserAccountDto> {
        const fields: FormFields<UpdateUserAccountDto> = {
            username   : [ { value: this.initialValues?.username, disabled: true } ],
            lastLoginAt: [ { value: this.initialValues?.lastLoginAt, disabled: true } ],
            isAdmin    : [ { value: this.initialValues?.isAdmin, disabled: true } ]
        };
        return this.formBuilder.nonNullable.group<UpdateUserAccountDto>( fields );
    }

    protected override onSubmit(): void | Promise<void> {
        return;
    }
}
