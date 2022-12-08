import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';

export class FormInputErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return valueIsNotEmpty( control )
            && valueIsNotEmpty( form )
            && control.touched
            && valueIsNotEmpty( control.errors )
            && form.form.invalid;
    }
}
