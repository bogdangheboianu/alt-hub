import { Attribute, Component, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { WeekDayEnum } from '@dtos/week-day.enum';
import { BaseFormInput } from '@shared/directives/base-form-input.directive';

@Component( {
                selector   : 'app-week-day-select',
                templateUrl: './week-day-select.component.html',
                styleUrls  : [ './week-day-select.component.scss' ]
            } )
export class WeekDaySelectComponent extends BaseFormInput<WeekDayEnum[]> {
    weekDays = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];

    constructor(
        @Optional() @Self() public controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }

    isDaySelected(day: WeekDayEnum): boolean {
        return this.value.includes( day );
    }

    toggleWeekDay(change: MatButtonToggleChange): void {
        const day = change.value as WeekDayEnum;
        const newValue = change.source.checked
                         ? [ ...this.value, day ]
                         : this.value.filter( d => d !== day );
        this.writeValue( newValue );
        this.onChange( newValue );
    }
}
