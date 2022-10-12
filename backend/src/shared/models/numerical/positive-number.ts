import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class PositiveNumber implements IValueObject<PositiveNumber, number> {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(value: number, propertyName: string): Result<PositiveNumber> {
        const validation = ValidationChain.validate<any>()
                                          .isNumber( value, propertyName )
                                          .isGreaterThan( value, 0, propertyName )
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

    divideBy(value: number): PositiveNumber {
        return new PositiveNumber( this.value / value );
    }

    update(value: number, propertyName: string): Result<PositiveNumber> {
        return PositiveNumber.create( value, propertyName );
    }
}
