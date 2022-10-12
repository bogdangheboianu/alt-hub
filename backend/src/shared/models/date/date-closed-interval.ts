import { Failed, Success } from '@shared/functions/result-builder.functions';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { Interval } from '@shared/models/interval/interval';

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

    static load(from: MandatoryDate, to: MandatoryDate, fromPropertyName = 'from', toPropertyName = 'to'): Result<DateClosedInterval> {
        const validation = this.validate( from, to, fromPropertyName, toPropertyName );

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new DateClosedInterval( from, to ) );
    }

    static create(from: Date, to: Date, fromPropertyName = 'from', toPropertyName = 'to'): Result<DateClosedInterval> {
        const fromResult = MandatoryDate.create( from, fromPropertyName );
        const toResult = MandatoryDate.create( to, toPropertyName );
        const result = Result.aggregateResults( fromResult, toResult );

        if( result.isFailed ) {
            return Failed( ...result.errors );
        }

        return this.load( fromResult.value!, toResult.value!, fromPropertyName, toPropertyName );
    }
}
