import { EventEmitter, inject } from '@angular/core';
import { FormBuilder, ValidatorFn } from '@angular/forms';
import { ComponentInstance, FormFields, FormGroupTyped, SubmitFn } from '@shared/config/constants/shared.types';
import { ServerValidator } from '@shared/config/functions/shared.validators';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { takeUntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

type AbstractFormData<InitialValues extends object | null = null> = {
    loadingSrc$?: Observable<boolean>,
    showInputViews?: boolean;
}

export abstract class AbstractForm<FormData extends object, InitialValues extends object | null = null> {
    form!: FormGroupTyped<FormData>;
    showInputViews: boolean;
    readonly: boolean;
    abstract loading: boolean;
    abstract onSubmit: EventEmitter<FormData> | SubmitFn<FormData>;
    abstract initialValues?: InitialValues | null;
    protected readonly fb: FormBuilder;

    protected constructor(data?: AbstractFormData<InitialValues>) {
        this.fb = inject( FormBuilder );
        this.showInputViews = data?.showInputViews ?? false;
        this.readonly = false;

        if( data?.loadingSrc$ && this.componentInstance() ) {
            data.loadingSrc$
                .pipe( takeUntilDestroy( this.componentInstance() ) )
                .subscribe( loading => this.loading = loading );
        }
    }

    init(validators?: ValidatorFn[], buildForm: boolean = true): void {
        if( buildForm ) {
            this.setForm( validators );
        }

        this.form.addAsyncValidators( ServerValidator() );
    }

    setForm(validators?: ValidatorFn[], ...fieldsArgs: any): void {
        this.form = this.buildForm( validators, ...fieldsArgs );
    }

    submit(customData?: FormData): void | Promise<void> {
        if( this.form.invalid ) {
            return this.form.markAllAsTouched();
        }

        const data = customData ?? this.form.getRawValue() as FormData;
        this.onSubmit instanceof EventEmitter
        ? this.onSubmit.emit( data )
        : this.onSubmit( data );
    }

    cancel(): void {
        this.reset();
        this.showInputViews = true;
    }

    reset(): void {
        if( valueIsNotEmpty( this.initialValues ) ) {
            this.form.patchValue( { ...this.initialValues! } );
        } else {
            this.form.patchValue( {} );
        }
        this.form.markAsUntouched();
        this.showInputViews = true;
    }

    hideInputViews(): void {
        if( !this.readonly ) {
            this.showInputViews = false;
        }
    }

    protected componentInstance(): ComponentInstance | null {
        return null;
    }

    protected abstract formFields(...args: any): FormFields<FormData>;

    private buildForm(validators?: ValidatorFn[], ...fieldsArgs: any): FormGroupTyped<FormData> {
        // @ts-ignore
        return this.fb.nonNullable.group<FormData>( this.formFields( ...fieldsArgs ), { validators } );
    }
}
