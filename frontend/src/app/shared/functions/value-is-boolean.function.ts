import { isBoolean } from 'lodash';

export const valueIsBoolean = (value: any): value is boolean => {
    return isBoolean( value ) || value === 'true' || value === 'false';
};
