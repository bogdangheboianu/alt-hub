import { Attribute, Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

@Component( {
                selector   : 'app-text-input',
                templateUrl: './text-input.component.html',
                styleUrls  : [ './text-input.component.scss' ]
            } )
export class TextInputComponent extends BaseFormInput<string> {
    errorStateMatcher = new FormInputErrorStateMatcher();

    constructor(
        @Optional() @Self() public readonly controlDir: NgControl,
        @Attribute( 'formControlName' ) public readonly formControlName: string
    ) {
        super( controlDir );
    }
}
