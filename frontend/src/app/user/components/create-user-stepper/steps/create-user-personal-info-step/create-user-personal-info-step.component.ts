import { Component, ViewChild } from '@angular/core';
import { BaseStepContent } from '@shared/directives/base-step-content.directive';
import { CreatePersonalInfoFormComponent } from '@user/components/create-personal-info-form/create-personal-info-form.component';
import { ICreatePersonalInfo } from '@user/interfaces/create-personal-info.interface';
import { UserSelectors } from '@user/store/user.selectors';

@Component( {
                selector   : 'app-create-user-personal-info-step',
                templateUrl: './create-user-personal-info-step.component.html',
                styleUrls  : [ './create-user-personal-info-step.component.scss' ]
            } )
export class CreateUserPersonalInfoStepComponent extends BaseStepContent<ICreatePersonalInfo> {
    @ViewChild( CreatePersonalInfoFormComponent )
    override form!: CreatePersonalInfoFormComponent;

    override nextStepDisabled = false;
    override previousStepDisabled = false;
    override isLastStep = false;

    constructor(
        private userSelectors: UserSelectors
    ) {
        super( userSelectors.selectNewUserPersonalInfo.bind( userSelectors ) );
    }
}
