import { Attribute, Component, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';
import { minutesToReadableTime } from '@shared/functions/duration.functions';
import { TimeWorkedInputErrorStateMatcher } from '@work-log/models/time-worked-input-error-state-matcher';

@Component( {
                selector   : 'app-time-worked-input',
                templateUrl: './time-worked-input.component.html',
                styleUrls  : [ './time-worked-input.component.scss' ]
            } )
export class TimeWorkedInputComponent extends BaseFormInput<string | number> implements OnInit {
    errorStateMatcher = new TimeWorkedInputErrorStateMatcher();

    constructor(
        @Optional() @Self() public readonly controlDir: NgControl,
        @Attribute( 'formControlName' ) public readonly formControlName: string
    ) {
        super( controlDir );
    }

    override ngOnInit(): void {
        super.ngOnInit();

        if( typeof this.value !== 'number' ) {
            throw TypeError( 'Time worked input value must be type number' );
        }

        this.writeValue( minutesToReadableTime( this.value as number )
                             .replace( ' ', '' ) );
        this.onChange( this.value );
    }
}
