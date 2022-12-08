import { HttpErrorResponseDto } from '@dtos/http-error-response-dto';
import { ClosedDateInterval } from '@shared/config/constants/shared.types';
import { ISelectInputOption } from '@shared/ui/input/select-input.component';
import { isArray, isBoolean, isEmpty, isFunction, isNil, isString } from 'lodash-es';

export function valueIsEmpty(value: Object | string | number | boolean | null | undefined | ((...args: any) => any)): value is undefined | null {

    if( typeof value === 'number' || typeof value === 'boolean' ) {
        return isNil( value );
    }

    if( value instanceof Date ) {
        return false;
    }

    if( isArray( value ) ) {
        return value.length === 0;
    }

    if( isFunction( value ) ) {
        return value === null || value === undefined;
    }

    return isNil( value ) || isEmpty( value );
}

export function valueIsNotEmpty<T>(value: Object | string | number | null | undefined | T | ((...args: any) => any)): value is NonNullable<T> {
    if( value === null || value === undefined ) {
        return false;
    }

    if( typeof value === 'string' ) {
        return value.trim().length > 0;
    }

    if( isArray( value ) ) {
        return value.length > 0;
    }

    return !isNil( value ) && !isEmpty( value );
}

export const valueIsDefined = <T>(input: null | undefined | T): input is NonNullable<T> => input !== null && input !== undefined;
export const valueIsString = (value: any): value is string => valueIsDefined( value ) && isString( value );
export const valueIsNumber = (value: any): value is number => valueIsDefined( value ) && Number.isFinite( value );
export const valueIsBoolean = (value: any): value is boolean => valueIsDefined( value ) && isBoolean( value ) || value === 'true' || value === 'false';
export const valueIsDate = (value: any): value is Date => valueIsDefined( value ) && !isNaN( Date.parse( value ) );
export const valueIsDateInterval = (value: any): value is ClosedDateInterval => valueIsNotEmpty( value ) && 'fromDate' in value && 'toDate' in value;
export const valueIsObject = (value: any): value is object => valueIsDefined( value ) && typeof value === 'object';
export const valueIsArray = (value: any): value is Array<any> => valueIsDefined( value ) && isArray( value );
export const valueIsHttpErrorResponseDto = (obj: any): obj is HttpErrorResponseDto => 'errors' in obj && 'statusCode' in obj && 'message' in obj;
export const valueIsSelectInputOption = (value: any): value is ISelectInputOption => valueIsNotEmpty( value ) && typeof value === 'object' && 'id' in value && 'name' in value;

export const atLeastOneValueDefined = (...values: any[]): boolean => {
    for( const value of values ) {
        if( valueIsDefined( value ) ) {
            return true;
        }
    }
    return false;
};
