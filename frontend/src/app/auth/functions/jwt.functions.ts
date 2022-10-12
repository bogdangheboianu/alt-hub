import { DecodedJwt } from '@auth/types/decoded-jwt.type';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import jwtDecode from 'jwt-decode';

export const jwtIsValid = (token: string | null): boolean => {
    if( valueIsEmpty( token ) ) {
        return false;
    }

    const decodedJwt = decodeJwt( token );

    if( valueIsEmpty( decodedJwt ) ) {
        return false;
    }

    return decodedJwt.exp * 1000 > Date.now();
};

export const decodeJwt = (token: string): DecodedJwt | null => {
    try {
        return jwtDecode( token );
    } catch( Error ) {
        return null;
    }
};
