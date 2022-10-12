import { isDate } from 'lodash';

export const valueIsDate = (value: any): value is Date => {
    return isDate( value ) || value instanceof Date || !isNaN( Date.parse( value ) );
};
