import { Attribute, Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

@Component( {
                selector   : 'app-password-input',
                templateUrl: './password-input.component.html',
                styleUrls  : [ './password-input.component.scss' ]
            } )
export class PasswordInputComponent extends BaseFormInput<string> {
    hide = true;
    errorStateMatcher = new FormInputErrorStateMatcher();

    constructor(
        @Optional() @Self() public controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }
}
