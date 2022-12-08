import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsString } from '@shared/functions/value-is-string.function';
import { TransformFnParams } from 'class-transformer/types/interfaces';
import { isArray } from 'lodash';

export function arrayQueryParamTransform(params: TransformFnParams): string[] {
    if( valueIsEmpty( params.value ) ) {
        return [];
    }

    if( valueIsString( params.value ) ) {
        return params.value.trim()
                     .split( ',' );
    }

    if( isArray( params.value ) ) {
        return params.value as string[];
    }

    return [];
}
