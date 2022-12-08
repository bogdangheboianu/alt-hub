import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { readableDate } from '@shared/config/functions/date.functions';
import { valueIsArray, valueIsBoolean, valueIsDate, valueIsDateInterval, valueIsEmpty, valueIsNumber, valueIsSelectInputOption, valueIsString } from '@shared/config/functions/value.functions';

@Component( {
                standalone     : true,
                selector       : 'app-input-view',
                template       : `
                    <div class="d-flex flex-column align-items-start justify-content-start input-view" (click)="clicked()">
                        <span class="input-view-label">{{ label }}</span>
                        <span>{{ displayValue }}</span>
                    </div>
                `,
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class InputViewComponent<T> {
    @Input()
    label!: string;

    @Input()
    set value(value: T) {
        this.displayValue = this.getDisplayValue( value );
    }

    @Output()
    onClick = new EventEmitter<void>();

    displayValue: string = '';

    clicked(): void {
        this.onClick.emit();
    }

    private getDisplayValue(value: T): string {
        if( valueIsEmpty( value ) ) {
            return '-';
        }

        if( valueIsNumber( value ) ) {
            return value.toString();
        }

        if( valueIsDate( value ) ) {
            return readableDate( value );
        }

        if( valueIsBoolean( value ) ) {
            return value
                   ? 'Yes'
                   : 'No';
        }

        if( valueIsSelectInputOption( value ) ) {
            return value.name;
        }

        if( valueIsArray( value ) ) {
            return value.join( ', ' );
        }

        if( valueIsString( value ) ) {
            return value;
        }

        if( valueIsDateInterval( value ) ) {
            return `${ readableDate( value.fromDate ) } -> ${ readableDate( value.toDate ) }`;
        }

        return '';
    }
}
