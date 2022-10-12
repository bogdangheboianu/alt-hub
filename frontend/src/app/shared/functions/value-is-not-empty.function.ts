import { isArray, isEmpty, isNil } from 'lodash';

export function valueIsNotEmpty<T>(value: Object | string | number | null | undefined | T): value is T {
    if( typeof value === 'string' ) {
        return value.trim().length > 0;
    }

    if( isArray( value ) ) {
        return value.length > 0;
    }

    return !isNil( value ) && !isEmpty( value );
}
