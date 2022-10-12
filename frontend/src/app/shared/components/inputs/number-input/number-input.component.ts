import { Attribute, Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

@Component( {
                selector   : 'app-number-input',
                templateUrl: './number-input.component.html',
                styleUrls  : [ './number-input.component.scss' ]
            } )
export class NumberInputComponent extends BaseFormInput<number> {
    errorStateMatcher = new FormInputErrorStateMatcher();

    constructor(
        @Optional() @Self() public controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }
}
