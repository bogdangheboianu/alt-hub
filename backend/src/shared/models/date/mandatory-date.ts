import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { IntervalPoint } from '@shared/interfaces/interval/interval-point.interface';
import { BaseDate } from '@shared/models/date/base-date';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import dayjs, { ManipulateType } from 'dayjs';

export class MandatoryDate extends BaseDate<MandatoryDate> implements IntervalPoint<Date>, IValueObject<MandatoryDate, Date> {
    private readonly value: Date;

    private constructor(value: Date) {
        super( value );
        this.value = value;
    }

    static now(): MandatoryDate {
        return new MandatoryDate( new Date() );
    }

    static create(value: Date, propertyName: string): Result<MandatoryDate> {
        const validation = ValidationChain.validate<any>()
                                          .isValidDate( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new MandatoryDate( value ) );
    }

    getValue(): Date {
        return this.value;
    }

    override add(value: number | null, unit: ManipulateType): MandatoryDate {
        if( valueIsEmpty( value ) ) {
            return this;
        }

        const newValue = dayjs( this.value )
            .add( value, unit )
            .toDate();

        return new MandatoryDate( newValue );
    }

    update(value: Date, propertyName: string): Result<MandatoryDate> {
        return MandatoryDate.create( value, propertyName );
    }
}
