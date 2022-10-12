import { FormControl, FormGroup } from '@angular/forms';

export type FormControlsTyped<T> = { [k in keyof T]: FormControl<T[k]> }
export type FormGroupTyped<T> = FormGroup<FormControlsTyped<T>>
export type FormFields<T> = Record<keyof T, any>;
