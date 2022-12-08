import { DecodedJwt } from '@auth/config/auth.types';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
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
