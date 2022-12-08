import { CurrencyEnum } from '@shared/enums/currency.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class Currency implements IValueObject<Currency, CurrencyEnum> {
    private readonly value: CurrencyEnum;

    private constructor(value: CurrencyEnum) {
        this.value = value;
    }

    static create(value: CurrencyEnum | string, propertyName: string = 'currency'): Result<Currency> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, CurrencyEnum, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new Currency( value.trim() as CurrencyEnum ) );
    }

    getValue(): CurrencyEnum {
        return this.value;
    }

    equals(to: Currency): boolean {
        return this.value === to.value;
    }
}
