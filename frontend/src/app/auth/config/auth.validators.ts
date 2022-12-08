import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PasswordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password1 = control.get( 'password1' );
    const password2 = control.get( 'password2' );

    return password1 && password2 && password1.value === password2.value
           ? null
           : { password2: true };
};

