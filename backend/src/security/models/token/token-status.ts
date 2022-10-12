import { ACTIVE_TOKEN_STATUSES } from '@security/constants/token.constants';
import { TokenStatusEnum } from '@security/enums/token/token-status.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class TokenStatus implements IValueObject<TokenStatus, TokenStatusEnum> {
    private readonly value: TokenStatusEnum;

    private constructor(value: TokenStatusEnum) {
        this.value = value;
    }

    static active(): TokenStatus {
        return new TokenStatus( TokenStatusEnum.Active );
    }

    static consumed(): TokenStatus {
        return new TokenStatus( TokenStatusEnum.Consumed );
    }

    static expired(): TokenStatus {
        return new TokenStatus( TokenStatusEnum.Expired );
    }

    static blacklisted(): TokenStatus {
        return new TokenStatus( TokenStatusEnum.Blacklisted );
    }

    static create(value: string | TokenStatusEnum): Result<TokenStatus> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, TokenStatusEnum, 'status' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new TokenStatus( value as TokenStatusEnum ) );
    }

    getValue(): TokenStatusEnum {
        return this.value;
    }

    equals(to: TokenStatus): boolean {
        return this.value === to.getValue();
    }

    hasValueActive(): boolean {
        return this.value === TokenStatusEnum.Active;
    }

    isNonActive(): boolean {
        return !ACTIVE_TOKEN_STATUSES.includes( this.getValue() );
    }
}
