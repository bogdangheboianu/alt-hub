import { isArray, isEmpty, isNil } from 'lodash';

export function valueIsNotEmpty<T>(value: Object | string | number | null | undefined | T): value is NonNullable<T> {
    if( typeof value === 'string' ) {
        return value.trim().length > 0;
    }

    if( isArray( value ) ) {
        return value.length > 0;
    }

    if( value instanceof Date ) {
        return true;
    }

    return !isNil( value ) && !isEmpty( value );
}
