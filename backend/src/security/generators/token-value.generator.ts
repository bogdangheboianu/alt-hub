import { TokenValue } from '@security/models/token/token-value';

export class TokenValueGenerator {
    static generateAccountConfirmationTokenValue(): TokenValue {
        const value = Math.random()
                          .toString( 36 )
                          .replace( /[^a-z]+/g, '' )
                          .substring( 0, 5 );

        return TokenValue.ofUnchecked( value );
    }
}
