import { datesAreEqual } from '@shared/functions/dates-are-equal.function';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IntervalPoint } from '@shared/interfaces/interval/interval-point.interface';
import dayjs, { ManipulateType } from 'dayjs';

export abstract class BaseDate<T extends IntervalPoint<Date | null>> {
    private readonly _value: Date | null;

    protected constructor(value?: Date) {
        this._value = value ?? null;
    }

    abstract add(value: number | null, unit: ManipulateType): BaseDate<T>;

    equals(to: T, ignoreTime = false): boolean {
        if( valueIsEmpty( this._value ) && valueIsEmpty( to.getValue() ) ) {
            return true;
        }

        if( valueIsEmpty( this._value ) || valueIsEmpty( to.getValue() ) ) {
            return false;
        }

        return ignoreTime
               ? datesAreEqual( this._value!, to.getValue()! )
               : this._value === to.getValue();
    }

    isBefore(other: T): boolean {
        return dayjs( this._value )
            .isBefore( other.getValue() );
    }

    isBeforeOrEqual(other: T): boolean {
        return dayjs( this._value )
            .isBefore( other.getValue() ) || this.equals( other );
    }

    isAfter(other: T): boolean {
        return dayjs( this._value )
            .isAfter( other.getValue() );
    }

    isAfterOrEqual(other: T): boolean {
        return dayjs( this._value )
            .isAfter( other.getValue() ) || this.equals( other );
    }

    isFutureDate(): boolean {
        return dayjs( this._value )
            .isAfter( new Date() );
    }

    isPastDate(): boolean {
        return dayjs( this._value )
            .isBefore( new Date() );
    }

    isSet(): boolean {
        return valueIsNotEmpty( this._value );
    }

    isNotSet(): boolean {
        return !this.isSet();
    }

    toString(): string {
        return dayjs( this._value )
            .format( 'DD/MM/YYYY' );
    }
}
