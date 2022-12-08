import { valueIsEmpty } from '@shared/config/functions/value.functions';

export const arrayMinusArray = <T>(array1: T[], array2: T[], objKey?: keyof T): T[] => {
    if( valueIsEmpty( objKey ) ) {
        return array1.filter( item => !array2.includes( item ) );
    }

    return array1.filter( i1 => valueIsEmpty( array2.find( i2 => i2[objKey] === i1[objKey] ) ) );
};

export const arrayDistinct = <T>(array: T[]): T[] => {
    const distinct = <T>(value: T, index: number, self: T[]): boolean => self.indexOf( value ) === index;
    return array.filter( distinct );
};
