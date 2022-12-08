import { InvalidIntervalException, UndefinedIntervalException } from '@shared/exceptions/interval.exceptions';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IntervalPoint } from '@shared/interfaces/interval/interval-point.interface';
import { Result } from '@shared/models/generics/result';

export class Interval<T> {
    protected readonly _from!: IntervalPoint<T>;
    protected readonly _to!: IntervalPoint<T>;

    protected constructor(from: IntervalPoint<T>, to: IntervalPoint<T>) {
        this._from = from;
        this._to = to;
    }

    static validate<T>(from: IntervalPoint<T>, to: IntervalPoint<T>, fromPropertyName = 'from', toPropertyName = 'to', allowEmpty = false, allowSameValues = false): Result<any> {
        const intervalIsEmpty = from.isNotSet() && to.isNotSet();

        if( intervalIsEmpty && !allowEmpty ) {
            return Failed( new UndefinedIntervalException( fromPropertyName, toPropertyName ) );
        }

        if( !intervalIsEmpty && !allowEmpty && !allowSameValues && !from.isBefore( to ) ) {
            return Failed( new InvalidIntervalException( fromPropertyName, toPropertyName ) );
        }

        return Success();
    }

    equals(other: Interval<T>): boolean {
        return this._from.equals( other._from ) && this._to.equals( other._to );
    }

    includes(point: IntervalPoint<T>): boolean {
        return this._from.isBeforeOrEqual( point ) && this._to.isAfterOrEqual( point );
    }

    isBefore(other: Interval<T>): boolean {
        return this._to.isBeforeOrEqual( other._from );
    }

    isAfter(other: Interval<T>): boolean {
        return this._from.isAfterOrEqual( other._to );
    }

    overlaps(other: Interval<T>): boolean {
        return other.includes( this._from ) || other.includes( this._to );
    }

    isEmpty(): boolean {
        return this._from.isNotSet() && this._to.isNotSet();
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }
}
