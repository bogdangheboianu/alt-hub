import { DivisionByZeroException, NegativeValueException } from '@shared/exceptions/numbers.exceptions';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class PositiveNumber implements IValueObject<PositiveNumber, number> {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static ofUnchecked(value: number): PositiveNumber {
        return new PositiveNumber( value );
    }

    static create(value: number, propertyName: string): Result<PositiveNumber> {
        const validation = ValidationChain.validate<any>()
                                          .isNumber( value, propertyName )
                                          .isEqualOrGreaterThan( value, 0, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new PositiveNumber( value ) );
    }

    getValue(): number {
        return this.value;
    }

    equals(to: PositiveNumber): boolean {
        return this.value === to.getValue();
    }

    plus(value: number | PositiveNumber): Result<PositiveNumber> {
        const newValue = value instanceof PositiveNumber
                         ? this.value + value.getValue()
                         : this.value + value;

        if( newValue < 0 ) {
            return Failed( new NegativeValueException() );
        }

        return Success( new PositiveNumber( newValue ) );
    }

    minus(value: number | PositiveNumber): Result<PositiveNumber> {
        const newValue = value instanceof PositiveNumber
                         ? this.value - value.getValue()
                         : this.value - value;

        if( newValue < 0 ) {
            return Failed( new NegativeValueException() );
        }

        return Success( new PositiveNumber( newValue ) );
    }

    divideBy(byValue: number | PositiveNumber): Result<PositiveNumber> {
        if( typeof byValue === 'number' && byValue === 0 ) {
            return Failed( new DivisionByZeroException() );
        }

        return Success( new PositiveNumber( this.value / (
            byValue instanceof PositiveNumber
            ? byValue.getValue()
            : byValue
        ) ) );
    }

    multiplyBy(byValue: number | PositiveNumber): PositiveNumber {
        return new PositiveNumber( this.value * (
            byValue instanceof PositiveNumber
            ? byValue.getValue()
            : byValue
        ) );
    }

    update(value: number, propertyName: string): Result<PositiveNumber> {
        return PositiveNumber.create( value, propertyName );
    }

    isZero(): boolean {
        return this.value === 0;
    }

    isGreaterThan(value: number | PositiveNumber): boolean {
        return this.value > (
            value instanceof PositiveNumber
            ? value.getValue()
            : value
        );
    }
}
