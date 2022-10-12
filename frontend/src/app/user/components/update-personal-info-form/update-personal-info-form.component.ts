import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonalInfoDto } from '@dtos/personal-info.dto';
import { UpdatePersonalInfoDto } from '@dtos/update-personal-info.dto';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { UserOperationMessage } from '@user/constants/user-operation-message.enum';
import { UserActions } from '@user/store/user.actions';
import { UserSelectors } from '@user/store/user.selectors';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-update-personal-info-form',
                templateUrl: './update-personal-info-form.component.html',
                styleUrls  : [ './update-personal-info-form.component.scss' ]
            } )
@UntilDestroy()
export class UpdatePersonalInfoFormComponent extends BaseForm<UpdatePersonalInfoDto, PersonalInfoDto> implements OnInit {
    @Input() userId!: string;

    form!: FormGroupTyped<UpdatePersonalInfoDto>;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly userSelectors: UserSelectors,
        private readonly userActions: UserActions
    ) {
        super( userSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.activateViewMode();
        this.form = this.buildForm();
    }

    cancelEdit(): void {
        this.reset();
        this.activateViewMode();
    }

    protected override buildForm(): FormGroupTyped<UpdatePersonalInfoDto> {
        const fields: FormFields<UpdatePersonalInfoDto> = {
            email      : [ this.initialValues?.email, [ Validators.required, Validators.email ] ],
            firstName  : [ this.initialValues?.firstName, Validators.required ],
            lastName   : [ this.initialValues?.lastName, Validators.required ],
            dateOfBirth: [ this.initialValues?.dateOfBirth, Validators.required ],
            ssn        : [ this.initialValues?.ssn, Validators.required ],
            address    : [ this.initialValues?.address, Validators.required ],
            phone      : [ this.initialValues?.phone, Validators.required ]
        };
        return this.formBuilder.nonNullable.group<UpdatePersonalInfoDto>( fields );
    }

    protected override onSubmit(): void {
        this.userActions.updateUserPersonalInfo( this.userId, this.form.getRawValue() );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage {
        this.cancelEdit();
        return UserOperationMessage.PersonalInfoUpdated;
    }
}
