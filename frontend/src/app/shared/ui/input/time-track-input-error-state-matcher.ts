import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { timeStringToMinutes } from '@shared/config/functions/duration.functions';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

export class TimeTrackInputErrorStateMatcher extends FormInputErrorStateMatcher {
    override isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const minutes = timeStringToMinutes( control?.value );
        return super.isErrorState( control, form ) || valueIsEmpty( minutes ) || minutes > 24 * 60 - 1;
    }
}
