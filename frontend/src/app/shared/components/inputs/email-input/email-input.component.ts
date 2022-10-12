import { Attribute, Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

@Component( {
                selector   : 'app-email-input',
                templateUrl: './email-input.component.html',
                styleUrls  : [ './email-input.component.scss' ]
            } )
export class EmailInputComponent extends BaseFormInput<string> {
    errorStateMatcher = new FormInputErrorStateMatcher();

    constructor(
        @Optional() @Self() public controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }
}
