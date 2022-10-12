import { FormGroupTyped } from '@shared/types/form.types';

export interface IForm<T> {
    form: FormGroupTyped<T>;

    submit(): void | boolean;
}
