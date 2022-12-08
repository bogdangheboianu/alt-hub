export const valueIsTrue = (value: string | number | boolean): boolean => {
    if( typeof value === 'boolean' ) {
        return value;
    }

    if( typeof value === 'number' ) {
        return value === 1;
    }

    value = value.trim()
                 .toLowerCase();

    return value === 'true' || value === '1';
};
