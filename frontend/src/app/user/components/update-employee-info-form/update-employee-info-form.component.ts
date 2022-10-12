import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { companyPositionsToSelectInputOptions } from '@company/mappers/company.mappers';
import { CompanyActions } from '@company/store/company.actions';
import { CompanySelectors } from '@company/store/company.selectors';
import { EmployeeInfoDto } from '@dtos/employee-info.dto';
import { UpdateEmployeeInfoDto } from '@dtos/update-employee-info.dto';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { SelectInputOptions } from '@shared/interfaces/select-input-option.interface';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { UserOperationMessage } from '@user/constants/user-operation-message.enum';
import { IUpdateEmployeeInfo } from '@user/interfaces/update-employee-info.interface';
import { UserActions } from '@user/store/user.actions';
import { UserSelectors } from '@user/store/user.selectors';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { map, Observable } from 'rxjs';

@Component( {
                selector   : 'app-update-employee-info-form',
                templateUrl: './update-employee-info-form.component.html',
                styleUrls  : [ './update-employee-info-form.component.scss' ]
            } )
@UntilDestroy()
export class UpdateEmployeeInfoFormComponent extends BaseForm<IUpdateEmployeeInfo, EmployeeInfoDto> implements OnInit {
    @Input() userId!: string;

    form!: FormGroupTyped<IUpdateEmployeeInfo>;
    companyPositionsOptions$!: Observable<SelectInputOptions>;

    constructor(
        private formBuilder: FormBuilder,
        private companyActions: CompanyActions,
        private companySelectors: CompanySelectors,
        private userSelectors: UserSelectors,
        private userActions: UserActions
    ) {
        super( userSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.activateViewMode();
        this.loadCompanyPositionOptions();
        this.form = this.buildForm();
    }

    cancelEdit(): void {
        this.reset();
        this.activateViewMode();
    }

    protected override buildForm(): FormGroupTyped<IUpdateEmployeeInfo> {
        const fields: FormFields<IUpdateEmployeeInfo> = {
            employeeId       : [ { value: this.initialValues?.employeeId ?? null, disabled: true }, Validators.required ],
            companyPositionId: [ { id: this.initialValues?.companyPosition.id ?? null, name: this.initialValues?.companyPosition.name ?? null }, Validators.required ],
            hiredOn          : [ this.initialValues?.hiredOn ?? null, Validators.required ]
        };
        return this.formBuilder.nonNullable.group<IUpdateEmployeeInfo>( fields );
    }

    protected override onSubmit(): void {
        const { hiredOn, companyPositionId } = this.form.value;
        const data: UpdateEmployeeInfoDto = {
            hiredOn          : hiredOn!,
            companyPositionId: typeof companyPositionId === 'object'
                               ? companyPositionId.id
                               : companyPositionId!
        };

        this.userActions.updateUserEmployeeInfo( this.userId, data );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage {
        this.cancelEdit();
        return UserOperationMessage.EmployeeInfoUpdated;
    }

    private loadCompanyPositionOptions(): void {
        this.companyActions.loadCompany();
        this.companyPositionsOptions$ = this.companySelectors.selectCompanyPositions()
                                            .pipe( map( companyPositionsToSelectInputOptions ) );
    }
}
