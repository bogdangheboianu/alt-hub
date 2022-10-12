import { Token } from '@security/models/token/token';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';

export class AuthToken implements IValueObject<AuthToken, Token> {
    private readonly value: Token;

    private constructor(value: Token) {
        this.value = value;
    }

    static of(value: Token): AuthToken {
        return new AuthToken( value );
    }

    static create(value: string, user: User): Result<AuthToken> {
        const token = Token.createForAuth( value, user );

        if( token.isFailed ) {
            return Failed( ...token.errors );
        }

        return Success( new AuthToken( token.value! ) );
    }

    getValue(): Token {
        return this.value;
    }

    equals(to: AuthToken): boolean {
        return this.value.id.equals( to.getValue().id );
    }
}
