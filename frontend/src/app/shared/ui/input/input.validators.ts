import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function multipleDatesRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as Date[] | null;
        return value === null || value.length === 0
               ? { required: true }
               : null;
    };
}
