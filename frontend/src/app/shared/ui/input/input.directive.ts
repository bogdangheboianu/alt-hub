import { Directive, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { FormInputErrorStateMatcher } from '@shared/models/form-input-error-state-matcher';

@Directive( { selector: '[appInput]' } )
export class InputDirective<T> implements ControlValueAccessor {
    @Input()
    label!: string;

    @Input()
    placeholder: string = '';

    @Input()
    hint?: string;

    @Input()
    required: boolean = false;

    @Input()
    showInputView: boolean = false;

    @Input()
    autoFocus: boolean = false;

    @Output()
    onInputViewClick = new EventEmitter();

    value: T | null = null;
    disabled: boolean = false;
    errorStateMatcher = new FormInputErrorStateMatcher();

    set inputElement(value: MatInput) {
        if( this.autoFocus ) {
            setTimeout( () => value.focus(), 0 );
        }
    }

    onChange = (_: T | null) => {
    };
    onTouch = () => {
    };

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if( ngControl !== null ) {
            ngControl.valueAccessor = this;
        }
    }

    get errors(): string[] {
        const validationErrors = this.ngControl.errors;
        return valueIsEmpty( validationErrors )
               ? []
               : Object.entries( validationErrors )
                       .map( ([ key, value ]) => key === 'required'
                                                 ? `${ this.label } is required`
                                                 : value );
    }

    registerOnChange(fn: (value: T | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouch = fn;
    }

    writeValue(obj: T | null): void {
        this.value = obj;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    inputViewClicked(): void {
        this.onInputViewClick.emit();
    }
}
