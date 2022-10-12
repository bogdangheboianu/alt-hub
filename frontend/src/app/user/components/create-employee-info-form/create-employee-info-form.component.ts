import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { companyPositionsToSelectInputOptions } from '@company/mappers/company.mappers';
import { CompanyActions } from '@company/store/company.actions';
import { CompanySelectors } from '@company/store/company.selectors';
import { BaseForm } from '@shared/directives/base-form.directive';
import { SelectInputOptions } from '@shared/interfaces/select-input-option.interface';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { ICreateEmployeeInfo } from '@user/interfaces/create-employee-info.interface';
import { UserSelectors } from '@user/store/user.selectors';
import { UserStore } from '@user/store/user.store';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { map, Observable } from 'rxjs';

@Component( {
                selector   : 'app-create-employee-info-form',
                templateUrl: './create-employee-info-form.component.html',
                styleUrls  : [ './create-employee-info-form.component.scss' ]
            } )
@UntilDestroy()
export class CreateEmployeeInfoFormComponent extends BaseForm<ICreateEmployeeInfo> implements OnInit {
    form!: FormGroupTyped<ICreateEmployeeInfo>;
    companyPositionsOptions$!: Observable<SelectInputOptions>;

    constructor(
        private formBuilder: FormBuilder,
        private userStore: UserStore,
        private userSelectors: UserSelectors,
        private companyActions: CompanyActions,
        private companySelectors: CompanySelectors
    ) {
        super( userSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.loadCompanyPositionOptions();
        this.form = this.buildForm();
    }

    protected buildForm(): FormGroupTyped<ICreateEmployeeInfo> {
        const fields: FormFields<ICreateEmployeeInfo> = {
            companyPositionId: [ this.initialValues?.companyPositionId ?? '', Validators.required ],
            hiredOn          : [ this.initialValues?.hiredOn ?? null, Validators.required ]
        };
        return this.formBuilder.nonNullable.group<ICreateEmployeeInfo>( fields );
    }

    protected override onSubmit(): void {
        this.userStore.setNewUserEmployeeInfo( this.form.getRawValue() );
    }

    private loadCompanyPositionOptions(): void {
        this.companyActions.loadCompany();
        this.companyPositionsOptions$ = this.companySelectors.selectCompanyPositions()
                                            .pipe( map( companyPositionsToSelectInputOptions ) );
    }
}
