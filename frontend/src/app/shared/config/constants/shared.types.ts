import { FormControl, FormGroup } from '@angular/forms';

export type FormControlsTyped<T> = { [k in keyof T]: FormControl<T[k]> }
export type FormGroupTyped<T> = FormGroup<FormControlsTyped<T>>
export type FormFields<T> = Record<keyof T, any>;

export type SimpleFn = () => Promise<void> | void
export type SubmitFn<FormData> = (data: FormData) => void

export type ComponentInstance = any;

export type OpenDateInterval = { fromDate?: string; toDate?: string; }
export type ClosedDateInterval = { fromDate: string; toDate: string };

export type DeepPartial<T> = T extends Function
                             ? T
                             : T extends Array<infer InferredArrayMember>
                               ? DeepPartialArray<InferredArrayMember>
                               : T extends Object
                                 ? DeepPartialObject<T>
                                 : T | undefined

interface DeepPartialArray<T> extends Array<DeepPartial<T>> {
}

type DeepPartialObject<T> = {
    [Key in keyof T]?: DeepPartial<T[Key]>
}

type DotPrefix<T extends string> = T extends ''
                                   ? ''
                                   : `.${ T }`

export type DotNestedKeys<T> = (T extends object
                                ?
                                { [K in Exclude<keyof T, symbol>]: `${ K }${ DotPrefix<DotNestedKeys<T[K]>> }` }[Exclude<keyof T, symbol>]
                                : '') extends infer D
                               ? Extract<D, string>
                               : never;

export type SuccessMessage = string;
