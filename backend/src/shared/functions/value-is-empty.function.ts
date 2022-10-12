import { isArray, isEmpty, isNil } from 'lodash';

export function valueIsEmpty(value: Object | string | number | null | undefined): value is undefined | null {

    if( typeof value === 'number' ) {
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
