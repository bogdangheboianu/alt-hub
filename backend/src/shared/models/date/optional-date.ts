import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { IntervalPoint } from '@shared/interfaces/interval/interval-point.interface';
import { BaseDate } from '@shared/models/date/base-date';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import dayjs, { ManipulateType } from 'dayjs';

export class OptionalDate extends BaseDate<OptionalDate> implements IntervalPoint<Date | null>, IValueObject<OptionalDate, Date | null> {
    private readonly value: Date | null;

    private constructor(value?: Date) {
        super( value );
        this.value = value ?? null;
    }

    static empty(): OptionalDate {
        return new OptionalDate();
    }

    static now(): OptionalDate {
        return new OptionalDate( new Date() );
    }

    static create(value: Date | null | undefined, propertyName: string): Result<OptionalDate> {
        const validation = ValidationChain.validate<any>()
                                          .isValidDate( value, propertyName, true )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new OptionalDate( value! ) );
    }

    getValue(): Date | null {
        return this.value;
    }

    updateToNow(): OptionalDate {
        return OptionalDate.now();
    }

    update(value: Date | null | undefined, propertyName: string): Result<OptionalDate> {
        return OptionalDate.create( value, propertyName );
    }

    override add(value: number | null, unit: ManipulateType): OptionalDate {
        if( valueIsEmpty( value ) || valueIsEmpty( this.value ) ) {
            return this;
        }

        const newValue = dayjs( this.value )
            .add( value, unit )
            .toDate();

        return new OptionalDate( newValue );
    }
}
