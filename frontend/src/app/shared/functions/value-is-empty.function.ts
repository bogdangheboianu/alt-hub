import { isArray, isEmpty, isNil } from 'lodash';

export function valueIsEmpty(value: Object | string | number | boolean | null | undefined): value is undefined | null {

    if( typeof value === 'number' || typeof value === 'boolean' ) {
        return isNil( value );
    }

    if( value instanceof Date ) {
        return false;
    }

    if( isArray( value ) ) {
        return value.length === 0;
    }

    return isNil( value ) || isEmpty( value );
}
