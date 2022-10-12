import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class TokenValue implements IValueObject<TokenValue, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value.trim();
    }

    static ofUnchecked(value: string): TokenValue {
        return new TokenValue( value );
    }

    static create(value: string, propertyName = 'value'): Result<TokenValue> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new TokenValue( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: TokenValue): boolean {
        return this.value === to.getValue();
    }
}
