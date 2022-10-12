import { Attribute, Component, Input, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';
import { valueIsSelectInputOption } from '@shared/functions/value-is-select-input-option.function';
import { ISelectInputOption, SelectInputOptions } from '@shared/interfaces/select-input-option.interface';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

@Component( {
                selector   : 'app-select-input',
                templateUrl: './select-input.component.html',
                styleUrls  : [ './select-input.component.scss' ]
            } )
export class SelectInputComponent extends BaseFormInput<ISelectInputOption | string> implements OnInit {
    @Input() options!: SelectInputOptions;

    selectValue = '';
    errorStateMatcher = new FormInputErrorStateMatcher();

    constructor(
        @Optional() @Self() public controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.selectValue = valueIsSelectInputOption( this.value )
                           ? this.value.id
                           : this.value;
    }
}
