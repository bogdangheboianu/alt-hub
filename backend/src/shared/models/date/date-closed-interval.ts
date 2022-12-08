import { Failed, Success } from '@shared/functions/result-builder.functions';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { Interval } from '@shared/models/interval/interval';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import dayjs from 'dayjs';

export class DateClosedInterval extends Interval<Date> {
    constructor(from: MandatoryDate, to: MandatoryDate) {
        super( from, to );
    }

    get from(): MandatoryDate {
        return this._from as MandatoryDate;
    }

    get to(): MandatoryDate {
        return this._to as MandatoryDate;
    }

    static load(from: MandatoryDate, to: MandatoryDate, fromPropertyName = 'from', toPropertyName = 'to', allowSameValues = false): Result<DateClosedInterval> {
        const validation = this.validate( from, to, fromPropertyName, toPropertyName, false, allowSameValues );

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new DateClosedInterval( from, to ) );
    }

    static create(from: Date, to: Date, fromPropertyName = 'from', toPropertyName = 'to', allowSameValues = false): Result<DateClosedInterval> {
        const fromResult = MandatoryDate.create( from, fromPropertyName );
        const toResult = MandatoryDate.create( to, toPropertyName );
        const result = Result.aggregateResults( fromResult, toResult );

        if( result.isFailed ) {
            return Failed( ...result.errors );
        }

        return this.load( fromResult.value!, toResult.value!, fromPropertyName, toPropertyName, allowSameValues );
    }

    businessDays(includeLastDay = false): PositiveNumber {
        const to = dayjs( this.to.getValue() );
        const from = dayjs( this.from.getValue() );

        if( this.to.equals( this.from ) ) {
            //@ts-ignore
            return PositiveNumber.ofUnchecked( from.isBusinessDay()
                                               ? 1
                                               : 0 );
        }
        //@ts-ignore
        let businessDays = to.businessDiff( from );

        if( includeLastDay ) {
            businessDays++;
        }

        return PositiveNumber.ofUnchecked( businessDays );
    }

    update(from: Date, to: Date, fromPropertyName = 'from', toPropertyName = 'to', allowSameValues = false): Result<DateClosedInterval> {
        return DateClosedInterval.create( from, to, fromPropertyName, toPropertyName, allowSameValues );
    }

    isOneDay(): boolean {
        return this.from.equals( this.to );
    }

    isInThePast(): boolean {
        const now = MandatoryDate.now();
        return this.to.isBefore( now );
    }

    isInTheFuture(): boolean {
        const now = MandatoryDate.now();
        return this.from.isAfter( now );
    }

    isCurrent(): boolean {
        const now = MandatoryDate.now();
        return this.from.isBefore( now ) && this.to.isAfter( now );
    }
}
