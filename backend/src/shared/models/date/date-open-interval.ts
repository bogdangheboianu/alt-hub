import { Failed, Success } from '@shared/functions/result-builder.functions';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Result } from '@shared/models/generics/result';
import { Interval } from '@shared/models/interval/interval';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import dayjs from 'dayjs';

export class DateOpenInterval extends Interval<Date | null> {
    constructor(from: OptionalDate, to: OptionalDate) {
        super( from, to );
    }

    get from(): OptionalDate {
        return this._from as OptionalDate;
    }

    get to(): OptionalDate {
        return this._to as OptionalDate;
    }

    get businessDays(): PositiveNumber {
        const to = dayjs( this.to.getValue() );
        const from = dayjs( this.from.getValue() );
        //@ts-ignore
        const businessDays = to.businessDiff( from ) + 1;
        return PositiveNumber.create( businessDays, 'workingDays' ).value!;
    }

    static empty(): DateOpenInterval {
        return new DateOpenInterval( OptionalDate.empty(), OptionalDate.empty() );
    }

    static load(from: OptionalDate, to: OptionalDate, fromPropertyName = 'from', toPropertyName = 'to'): Result<DateOpenInterval> {
        const validation = this.validate( from, to, fromPropertyName, toPropertyName, true );

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new DateOpenInterval( from, to ) );
    }

    static create(from?: Date | null, to?: Date | null, fromPropertyName = 'from', toPropertyName = 'to'): Result<DateOpenInterval> {
        const fromResult = OptionalDate.create( from, fromPropertyName );
        const toResult = OptionalDate.create( to, toPropertyName );
        const result = Result.aggregateResults( fromResult, toResult );

        if( result.isFailed ) {
            return Failed( ...result.errors );
        }

        return this.load( fromResult.value!, toResult.value!, fromPropertyName, toPropertyName );
    }

    isInThePast(): boolean {
        const now = OptionalDate.now();
        const fromIsInThePastOrNotDefined = this.from.isBefore( now ) || this.from.isNotSet();
        const toIsInThePast = this.to.isSet() && this.to.isBefore( now );

        return fromIsInThePastOrNotDefined && toIsInThePast;
    }

    isInTheFuture(): boolean {
        const now = OptionalDate.now();
        const fromIsInTheFuture = this.from.isSet() && this.from.isAfter( now );
        const toIsInTheFutureOrNotDefined = this.to.isAfter( now ) || this.to.isNotSet();

        return fromIsInTheFuture && toIsInTheFutureOrNotDefined;
    }

    isCurrent(): boolean {
        const now = OptionalDate.now();
        const fromIsInThePast = this.from.isSet() && this.from.isBeforeOrEqual( now );
        const toIsInTheFuture = this.to.isSet() && this.to.isAfterOrEqual( now );
        const fromIsNotDefined = this.from.isNotSet();
        const toIsNotDefined = this.to.isNotSet();
        const toIsInTheFutureOrNotDefined = toIsInTheFuture || toIsNotDefined;

        return (
            fromIsInThePast && toIsInTheFutureOrNotDefined
        ) || (
            toIsInTheFuture && fromIsNotDefined
        );
    }

    update(from?: Date | null, to?: Date | null, fromPropertyName = 'from', toPropertyName = 'to'): Result<DateOpenInterval> {
        return DateOpenInterval.create( from, to, fromPropertyName, toPropertyName );
    }
}
