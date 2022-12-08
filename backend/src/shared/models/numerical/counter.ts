import { NegativeValueException } from '@shared/exceptions/numbers.exceptions';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class Counter implements IValueObject<Counter, number> {
    private value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static zero(): Counter {
        return new Counter( 0 );
    }

    static one(): Counter {
        return new Counter( 1 );
    }

    static from(value: PositiveNumber): Counter {
        return new Counter( value.getValue() );
    }

    static create(value: number, propertyName: string): Result<Counter> {
        const validation = ValidationChain.validate<any>()
                                          .isNumber( value, propertyName )
                                          .isEqualOrGreaterThan( value, 0, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new Counter( value ) );
    }

    getValue(): number {
        return this.value;
    }

    equals(to: Counter): boolean {
        return this.value === to.getValue();
    }

    increment(): Counter {
        this.value++;
        return this;
    }

    decrement(): Counter {
        this.value = this.value === 0
                     ? this.value
                     : this.value--;
        return this;
    }

    isZero(): boolean {
        return this.value === 0;
    }

    minus(value: number | Counter | PositiveNumber): Result<Counter> {
        const newValue = typeof value === 'number'
                         ? this.value - value
                         : this.value - value.getValue();

        if( newValue < 0 ) {
            return Failed( new NegativeValueException() );
        }

        return Success( new Counter( newValue ) );
    }

    update(value: number, propertyName: string): Result<Counter> {
        return Counter.create( value, propertyName );
    }
}
