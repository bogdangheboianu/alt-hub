import { TokenPurposeEnum } from '@security/enums/token/token-purpose.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class TokenPurpose implements IValueObject<TokenPurpose, TokenPurposeEnum> {
    private readonly value: TokenPurposeEnum;

    private constructor(value: TokenPurposeEnum) {
        this.value = value;
    }

    static forAuthentication(): TokenPurpose {
        return new TokenPurpose( TokenPurposeEnum.Authentication );
    }

    static forAccountActivation(): TokenPurpose {
        return new TokenPurpose( TokenPurposeEnum.AccountActivation );
    }

    static create(value: string | TokenPurposeEnum): Result<TokenPurpose> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, TokenPurposeEnum, 'purpose' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new TokenPurpose( value as TokenPurposeEnum ) );
    }

    getValue(): TokenPurposeEnum {
        return this.value;
    }

    equals(to: TokenPurpose): boolean {
        return this.value === to.getValue();
    }
}
