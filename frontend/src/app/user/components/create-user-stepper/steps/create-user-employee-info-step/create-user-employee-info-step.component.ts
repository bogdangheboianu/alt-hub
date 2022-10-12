import { Component, ViewChild } from '@angular/core';
import { BaseStepContent } from '@shared/directives/base-step-content.directive';
import { CreateEmployeeInfoFormComponent } from '@user/components/create-employee-info-form/create-employee-info-form.component';
import { ICreateEmployeeInfo } from '@user/interfaces/create-employee-info.interface';
import { UserSelectors } from '@user/store/user.selectors';

@Component( {
                selector   : 'app-create-user-employee-info-step',
                templateUrl: './create-user-employee-info-step.component.html',
                styleUrls  : [ './create-user-employee-info-step.component.scss' ]
            } )
export class CreateUserEmployeeInfoStepComponent extends BaseStepContent<ICreateEmployeeInfo> {
    @ViewChild( CreateEmployeeInfoFormComponent )
    override form!: CreateEmployeeInfoFormComponent;

    override nextStepDisabled = false;
    override previousStepDisabled = false;
    override isLastStep = false;

    constructor(
        private userSelectors: UserSelectors
    ) {
        super( userSelectors.selectNewUserEmployeeInfo.bind( userSelectors ) );
    }
}
