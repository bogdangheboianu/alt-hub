import { Attribute, Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';

@Component( {
                selector   : 'app-checkbox-input',
                templateUrl: './checkbox-input.component.html',
                styleUrls  : [ './checkbox-input.component.scss' ]
            } )
export class CheckboxInputComponent extends BaseFormInput<boolean> {
    constructor(
        @Optional() @Self() public controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }
}
