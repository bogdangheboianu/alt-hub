import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class MoneyAmount implements IValueObject<MoneyAmount, number> {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(value: number, fromDb: boolean, propertyName: string = 'amount'): Result<MoneyAmount> {
        const validation = ValidationChain.validate<any>()
                                          .isEqualOrGreaterThan( value, 0, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        if( fromDb ) {
            return Success( new MoneyAmount( value ) );
        }

        let totalDecimals = value.toString()
                                 .split( '.' ).length;
        totalDecimals = totalDecimals > 1
                        ? totalDecimals
                        : 2;
        const integerValue = value * (
            10 ** totalDecimals
        );

        return Success( new MoneyAmount( integerValue ) );
    }

    getValue(): number {
        return this.value;
    }

    equals(to: MoneyAmount): boolean {
        return this.value === to.getValue();
    }
}
