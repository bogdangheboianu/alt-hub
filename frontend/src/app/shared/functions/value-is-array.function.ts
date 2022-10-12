import { isArray } from 'lodash';

export const valueIsArray = (value: any): value is Array<any> => isArray( value );
