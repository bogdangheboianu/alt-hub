import { isString } from 'lodash';

export function valueIsString(value: any): value is string {
    return typeof value === 'string' || isString( value );
}
