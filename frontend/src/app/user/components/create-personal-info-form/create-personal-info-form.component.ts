import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm } from '@shared/directives/base-form.directive';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { ICreatePersonalInfo } from '@user/interfaces/create-personal-info.interface';
import { UserSelectors } from '@user/store/user.selectors';
import { UserStore } from '@user/store/user.store';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-create-personal-info-form',
                templateUrl: './create-personal-info-form.component.html',
                styleUrls  : [ './create-personal-info-form.component.scss' ]
            } )
@UntilDestroy()
export class CreatePersonalInfoFormComponent extends BaseForm<ICreatePersonalInfo> implements OnInit {
    form!: FormGroupTyped<ICreatePersonalInfo>;

    constructor(
        private formBuilder: FormBuilder,
        private userSelectors: UserSelectors,
        private userStore: UserStore
    ) {
        super( userSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    protected buildForm(): FormGroupTyped<ICreatePersonalInfo> {
        const fields: FormFields<ICreatePersonalInfo> = {
            firstName  : [ this.initialValues?.firstName ?? '', Validators.required ],
            lastName   : [ this.initialValues?.lastName ?? '', Validators.required ],
            dateOfBirth: [ this.initialValues?.dateOfBirth ?? null, Validators.required ],
            ssn        : [ this.initialValues?.ssn ?? '', Validators.required ],
            address    : [ this.initialValues?.address ?? '', Validators.required ],
            phone      : [ this.initialValues?.phone ?? '', Validators.required ]
        };
        return this.formBuilder.nonNullable.group<ICreatePersonalInfo>( fields );
    }

    protected override onSubmit(): void {
        this.userStore.setNewUserPersonalInfo( this.form.getRawValue() );
    }
}
