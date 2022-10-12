import { Attribute, Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

@Component( {
                selector   : 'app-date-input',
                templateUrl: './date-input.component.html',
                styleUrls  : [ './date-input.component.scss' ]
            } )
export class DateInputComponent extends BaseFormInput<Date> {
    @Input() maxDate?: Date;

    errorStateMatcher = new FormInputErrorStateMatcher();

    constructor(
        @Optional() @Self() public controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }
}
