import { isString } from 'lodash';

export const valueIsString = (value: any): value is string => isString( value );
