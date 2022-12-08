import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import union from 'lodash/union';

export function mergeArray<T extends object>(source: T | T[], add: T | T[]) {
    if( Array.isArray( source ) && Array.isArray( add ) ) {
        return union( source, add );
    }

    let result: any[];

    if( valueIsEmpty( source ) ) {
        result = [];
    } else {
        result = Array.isArray( source )
                 ? [ ...source ]
                 : [ source ];
    }

    if( valueIsEmpty( add ) ) {
        return result;
    }

    if( Array.isArray( add ) ) {
        return union( result, add );
    }

    return [ ...result, add ];
}
