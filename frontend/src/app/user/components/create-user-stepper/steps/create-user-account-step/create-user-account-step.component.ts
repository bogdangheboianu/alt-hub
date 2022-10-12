import { Component, ViewChild } from '@angular/core';
import { BaseStepContent } from '@shared/directives/base-step-content.directive';
import { CreateUserAccountFormComponent } from '@user/components/create-user-account-form/create-user-account-form.component';
import { ICreateUserAccount } from '@user/interfaces/create-user-account.interface';
import { UserSelectors } from '@user/store/user.selectors';

@Component( {
                selector   : 'app-create-user-account-step',
                templateUrl: './create-user-account-step.component.html',
                styleUrls  : [ './create-user-account-step.component.scss' ]
            } )
export class CreateUserAccountStepComponent extends BaseStepContent<ICreateUserAccount> {
    @ViewChild( CreateUserAccountFormComponent )
    override form!: CreateUserAccountFormComponent;

    override nextStepDisabled = false;
    override previousStepDisabled = true;
    override isLastStep = false;

    constructor(
        private userSelectors: UserSelectors
    ) {
        super( userSelectors.selectNewUserAccount.bind( userSelectors ) );
    }
}
