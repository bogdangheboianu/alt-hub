import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
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
}
