import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStep } from '@angular/material/stepper';
import { CreateUserDto } from '@dtos/create-user.dto';
import { SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { BaseStepper } from '@shared/directives/base-stepper.directive';
import { Steps } from '@shared/types/steps.type';
import { CreateUserAccountStepComponent } from '@user/components/create-user-stepper/steps/create-user-account-step/create-user-account-step.component';
import { CreateUserEmployeeInfoStepComponent } from '@user/components/create-user-stepper/steps/create-user-employee-info-step/create-user-employee-info-step.component';
import { CreateUserPersonalInfoStepComponent } from '@user/components/create-user-stepper/steps/create-user-personal-info-step/create-user-personal-info-step.component';
import { CreateUserSaveStepComponent } from '@user/components/create-user-stepper/steps/create-user-save-step/create-user-save-step.component';
import { UserOperationMessage } from '@user/constants/user-operation-message.enum';
import { UserUiEvents } from '@user/store/user-ui.events';
import { UserActions } from '@user/store/user.actions';
import { UserSelectors } from '@user/store/user.selectors';
import { UserStore } from '@user/store/user.store';
import { UntilDestroy } from 'ngx-reactivetoolkit';

export type CreateUserStepKey = 'userAccount' | 'userPersonalInfo' | 'userEmployeeInfo' | 'userSave';

@Component( {
                selector   : 'app-create-user-stepper',
                templateUrl: './create-user-stepper.component.html',
                styleUrls  : [ './create-user-stepper.component.scss' ]
            } )
@UntilDestroy()
export class CreateUserStepperComponent extends BaseStepper<CreateUserDto, CreateUserStepKey> {
    @ViewChild( CreateUserAccountStepComponent )
    userAccountStepContent!: CreateUserAccountStepComponent;

    @ViewChild( CreateUserPersonalInfoStepComponent )
    userPersonalInfoStepContent!: CreateUserPersonalInfoStepComponent;

    @ViewChild( CreateUserEmployeeInfoStepComponent )
    userEmployeeInfoStepContent!: CreateUserEmployeeInfoStepComponent;

    @ViewChild( CreateUserSaveStepComponent )
    userSaveStepContent!: CreateUserSaveStepComponent;

    @ViewChild( 'userAccountStep' )
    userAccountStep!: MatStep;

    @ViewChild( 'userPersonalInfoStep' )
    userPersonalInfoStep!: MatStep;

    @ViewChild( 'userEmployeeInfoStep' )
    userEmployeeStep!: MatStep;

    @ViewChild( 'userSaveStep' )
    userSaveStep!: MatStep;

    constructor(
        private dialogRef: MatDialogRef<CreateUserStepperComponent>,
        private userActions: UserActions,
        private userSelectors: UserSelectors,
        private userUiEvents: UserUiEvents,
        private userStore: UserStore
    ) {
        super( userSelectors, userSelectors.selectNewUserData.bind( userSelectors ) );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.userUiEvents.onCreateUserStepperOpened();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    protected override getSteps(): Steps<CreateUserStepKey> {
        return {
            userAccount     : {
                label    : 'Create account',
                component: this.userAccountStep,
                content  : this.userAccountStepContent,
                editable : true
            },
            userPersonalInfo: {
                label    : 'Personal data',
                component: this.userPersonalInfoStep,
                content  : this.userPersonalInfoStepContent,
                editable : true
            },
            userEmployeeInfo: {
                label    : 'Employment info',
                component: this.userEmployeeStep,
                content  : this.userEmployeeInfoStepContent,
                editable : true
            },
            userSave        : {
                label    : 'Save',
                component: this.userSaveStep,
                content  : this.userSaveStepContent,
                editable : false
            }
        };
    }

    protected override onSubmit(data: CreateUserDto): void {
        this.userActions.createUser( data );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage | void {
        this.userStore.resetNewUser();
        this.closeDialog();
        return UserOperationMessage.Created;
    }
}
