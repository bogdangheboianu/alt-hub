import { Component, Input } from '@angular/core';
import { BaseStepContent } from '@shared/directives/base-step-content.directive';
import { UserSelectors } from '@user/store/user.selectors';

@Component( {
                selector   : 'app-create-user-save-step',
                templateUrl: './create-user-save-step.component.html',
                styleUrls  : [ './create-user-save-step.component.scss' ]
            } )
export class CreateUserSaveStepComponent extends BaseStepContent<any> {
    @Input()
    override nextStepDisabled!: boolean;

    override form = undefined;
    override previousStepDisabled = false;
    override isLastStep = true;

    constructor(
        private userSelectors: UserSelectors
    ) {
        super( userSelectors.selectNewUserData.bind( userSelectors ) );
    }
}
