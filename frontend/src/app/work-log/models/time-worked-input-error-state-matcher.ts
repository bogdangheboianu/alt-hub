import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { timeStringToMinutes } from '@shared/functions/duration.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

@Injectable()
export class TimeWorkedInputErrorStateMatcher extends FormInputErrorStateMatcher {
    override isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const minutes = timeStringToMinutes( control?.value );
        return super.isErrorState( control, form ) || valueIsEmpty( minutes ) || minutes > 24 * 60 - 1;
    }
}
