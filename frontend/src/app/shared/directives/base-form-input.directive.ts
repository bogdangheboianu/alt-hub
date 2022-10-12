import { Directive, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { readableDate } from '@shared/functions/readable-date.function';
import { valueIsArray } from '@shared/functions/value-is-array.function';
import { valueIsBoolean } from '@shared/functions/value-is-boolean.function';
import { valueIsDate } from '@shared/functions/value-is-date.function';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNumber } from '@shared/functions/value-is-number.function';
import { valueIsSelectInputOption } from '@shared/functions/value-is-select-input-option.function';

@Directive()
export class BaseFormInput<T> implements ControlValueAccessor, OnInit {
    @Input()
    set value(value: T) {
        this._value = value;
        this.setDisplayValue();
    }

    get value(): T {
        return this._value;
    }

    @Input() label!: string;
    @Input() placeholder = '';
    @Input() required = false;
    @Input() disabled = false;
    @Input() hint?: string;
    @Input() viewMode = false;

    @Output() inputViewClick = new EventEmitter();

    displayValue!: string;
    onTouched!: () => void;
    onChange!: (value: T) => void;

    private _value!: T;

    protected constructor(@Optional() @Self() public readonly control: NgControl) {
        control.valueAccessor = this;
    }

    get errors(): string[] {
        const validationErrors = this.control.errors;
        return valueIsEmpty( validationErrors )
               ? []
               : Object.entries( validationErrors )
                       .map( ([ key, value ]) => key === 'required'
                                                 ? `${ this.label } is required`
                                                 : value );
    }

    ngOnInit(): void {
    }

    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    writeValue(obj: T): void {
        this.value = obj;
    }

    inputViewClicked(): void {
        this.inputViewClick.emit();
    }

    private setDisplayValue(): void {
        this.displayValue = this.getDisplayValue();
    }

    private getDisplayValue(): string {
        if( valueIsEmpty( this._value ) ) {
            return '-';
        }

        if( typeof this._value === 'string' ) {
            return this._value;
        }

        if( valueIsNumber( this._value ) ) {
            return this._value.toString();
        }

        if( valueIsDate( this._value ) ) {
            return readableDate( this._value );
        }

        if( valueIsBoolean( this._value ) ) {
            return this._value
                   ? 'Yes'
                   : 'No';
        }

        if( valueIsSelectInputOption( this._value ) ) {
            return this._value.name;
        }

        if( valueIsArray( this._value ) ) {
            return this._value.join( ', ' );
        }

        return '';
    }
}
