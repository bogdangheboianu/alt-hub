import { ValidationRulesEnum } from '@shared/enums/validation-rules.enum';
import { mergeArray } from '@shared/functions/merge-array.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { Result } from '@shared/models/generics/result';
import { AnyDate } from '@shared/types/any-date.type';
import { ValidationErrorHandler } from '@shared/types/validation-error-handler.type';
import { isBoolean, isDate, isEmail, isFQDN, isInt, isNumber, isPhoneNumber, isString, isUUID } from 'class-validator';
import dayjs from 'dayjs';
import { defaultTo, isArray, isBuffer, isFunction, isNaN, isNil } from 'lodash';
import { isUint8Array } from 'util/types';

export class ValidationChain<T> {
    private _result: Result<any>;

    private constructor() {
        this._result = Success();
    }

    static validate<T>() {
        return new ValidationChain<T>();
    }

    isNotEmpty(value: any, propertyName: Partial<keyof T>, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        let isEmpty = false;

        if( value instanceof Date ) {
            return this.ok();
        }

        if( typeof value === 'boolean' ) {
            isEmpty = isNil( value );
        } else if( typeof value === 'number' ) {
            isEmpty = false;
        } else if( typeof value === 'string' ) {
            value = value.trim();
            isEmpty = value === 'null' || value === 'undefined' || valueIsEmpty( value );
        } else {
            isEmpty = valueIsEmpty( value );
        }

        if( isEmpty ) {
            return this.fail( propertyName, ValidationRulesEnum.IsNotEmpty, customErr || `${ String( propertyName ) } is empty`, cb );
        }

        return this.ok();
    }

    isNotNull(value: any, propertyName: Partial<keyof T>, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        if( isNil( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsNotNull, customErr || `${ String( propertyName ) } is null or undefined`, cb );
        }

        return this.ok();
    }

    isLessThan(value: number, reference: number, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        if( isNil( value ) && isOptional ) {
            return this.ok();
        }

        if( isNil( value ) || isNil( reference ) || isNaN( value ) || Number( value ) > reference ) {
            return this.fail( propertyName, ValidationRulesEnum.IsLessThan, customErr || `${ String( propertyName ) } is not less than ${ reference }`, cb );
        }

        return this.ok();
    }

    isLessThanOrEqualTo(value: number, reference: number, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        if( isNil( value ) && isOptional ) {
            return this.ok();
        }

        if( isNil( value ) || isNil( reference ) || isNaN( value ) || Number( value ) >= reference ) {
            return this.fail( propertyName, ValidationRulesEnum.IsLessThanOrEqualTo, customErr || `${ String( propertyName ) } is not less than or equal to ${ reference }`, cb );
        }

        return this.ok();
    }

    isBetween(value: number, start: number, end: number, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || isNil( start ) || isNil( end ) || isNaN( value ) || Number( value ) < start || Number( value ) > end ) {
            return this.fail( propertyName, ValidationRulesEnum.IsBetween, customErr || `${ String( propertyName ) } is not between ${ start } and ${ end }`, cb );
        }

        return this.ok();
    }

    isGreaterThan(
        value: number | null | undefined,
        reference: number,
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || isNil( reference ) || isNaN( value ) || Number( value ) <= reference ) {
            return this.fail( propertyName, ValidationRulesEnum.IsGreaterThan, customErr || `${ String( propertyName ) } is not greater than ${ reference }`, cb );
        }

        return this.ok();
    }

    isEqualOrGreaterThan(
        value: number | null | undefined,
        reference: number,
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || isNil( reference ) || isNaN( value ) || Number( value ) < reference ) {
            return this.fail( propertyName, ValidationRulesEnum.IsEqualOrGreaterThan, customErr || `${ String( propertyName ) } is not equal or greater than ${ reference }`, cb );
        }

        return this.ok();
    }

    hasMinimumWords(
        value: string,
        reference: number,
        separator: string,
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        value = defaultTo( value, '' );
        const totalWords = value.trim()
                                .split( separator ).length;

        if( totalWords < reference ) {
            return this.fail( propertyName, ValidationRulesEnum.HasMinWords, customErr || `${ String( propertyName ) } has less than ${ reference } words`, cb );
        }

        return this.ok();
    }

    hasTotalWords(
        value: string,
        reference: number,
        separator: string,
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        value = defaultTo( value, '' );
        const totalWords = value.trim()
                                .split( separator ).length;

        if( totalWords !== reference ) {
            return this.fail( propertyName, ValidationRulesEnum.HasTotalWords, customErr || `${ String( propertyName ) } has more/less than ${ reference } words`, cb );
        }

        return this.ok();
    }

    isNotEqualTo(value: any, reference: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( this.areEqual( value, reference ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsNotEqualTo, customErr || `${ String( propertyName ) } is equal to ${ reference }`, cb );
        }

        return this.ok();
    }

    isEqualTo(value: any, reference: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( !this.areEqual( value, reference ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsEqualTo, customErr || `${ String( propertyName ) } is not equal to ${ reference }`, cb );
        }

        return this.ok();
    }

    hasMinimumLength(
        value: string | null | undefined,
        reference: number,
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        const len = valueIsEmpty( value )
                    ? 0
                    : value!.trim().length;

        if( isNil( reference ) || len < reference ) {
            return this.fail( propertyName, ValidationRulesEnum.HasMinimumLength, customErr || `${ String( propertyName ) } has a length less than ${ reference }`, cb );
        }

        return this.ok();
    }

    hasMaximumLength(value: string | null | undefined, reference: number, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        const len = valueIsEmpty( value )
                    ? 0
                    : value.trim().length;

        if( isNil( reference ) || len > reference ) {
            return this.fail( propertyName, ValidationRulesEnum.HasMaximumLength, customErr || `${ String( propertyName ) } has a length greater than ${ reference }`, cb );
        }

        return this.ok();
    }

    hasLengthEqualTo(value: string, reference: number, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        const len = valueIsEmpty( value )
                    ? 0
                    : value.trim().length;

        if( isNil( reference ) || len !== reference ) {
            return this.fail( propertyName, ValidationRulesEnum.HasLengthEqualTo, customErr || `${ String( propertyName ) } has a length different than ${ reference }`, cb );
        }

        return this.ok();
    }

    isEmail(value: string | null | undefined, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isEmail( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsEmail, customErr || `${ String( propertyName ) } is not a valid email`, cb );
        }

        return this.ok();
    }

    isInteger(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isInt( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsInteger, customErr || `${ String( propertyName ) } is not an integer`, cb );
        }

        return this.ok();
    }

    isTrue(value: boolean, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || value !== true ) {
            return this.fail( propertyName, ValidationRulesEnum.IsTrue, customErr || `${ String( propertyName ) } is not true`, cb );
        }

        return this.ok();
    }

    isFalse(value: boolean, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || value !== false ) {
            return this.fail( propertyName, ValidationRulesEnum.IsFalse, customErr || `${ String( propertyName ) } is not false`, cb );
        }

        return this.ok();
    }

    isSuccessful(value: Result<any>, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException | IException[], cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty ) {
            return this.fail( propertyName, ValidationRulesEnum.IsSuccessful, customErr || `${ String( propertyName ) } is undefined`, cb );
        }

        if( value.isNotFound ) {
            return this.fail( propertyName, ValidationRulesEnum.IsSuccessful, customErr || `${ String( propertyName ) } is not found`, cb );
        }

        if( value.isFailed ) {
            return this.fail( propertyName, ValidationRulesEnum.IsSuccessful, value.errors, cb );
        }

        return this.ok();
    }

    isFailed(value: Result<any>, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || value.isSuccessful ) {
            return this.fail( propertyName, ValidationRulesEnum.IsFailed, customErr || `${ String( propertyName ) } is not failed`, cb );
        }

        return this.ok();
    }

    isNotFound(value: Result<any>, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !value.isNotFound ) {
            return this.fail( propertyName, ValidationRulesEnum.IsNotFound, customErr || `${ String( propertyName ) } is found`, cb );
        }

        return this.ok();
    }

    isUnique(value: Result<any>, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !value.isNotFound ) {
            return this.fail( propertyName, ValidationRulesEnum.IsUnique, customErr || `${ String( propertyName ) } is not unique`, cb );
        }

        return this.ok();
    }

    isDomain(value: string, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isFQDN( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsDomain, customErr || `${ String( propertyName ) } is not a valid domain`, cb );
        }

        return this.ok();
    }

    isPhone(value: string | null | undefined, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( !isPhoneNumber( value!, 'RO' ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsPhone, customErr || `${ String( propertyName ) } is not a valid phone number`, cb );
        }

        return this.ok();
    }

    isString(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isString( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsString, customErr || `${ String( propertyName ) } is not a string`, cb );
        }

        return this.ok();
    }

    isStringList(valueList: any[] | undefined, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( valueList );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty ) {
            return this.fail( propertyName, ValidationRulesEnum.IsList, customErr || `${ String( propertyName ) } is not a string list`, cb );
        }

        for( const value of valueList! ) {
            const validation = this.isString( value, propertyName, isOptional, customErr, cb )
                                   .getResult();

            if( validation.isFailed ) {
                return this.fail( propertyName, ValidationRulesEnum.IsStringList, customErr || `${ String( propertyName ) } is not a valid string list`, cb );
            }
        }

        return this.ok();
    }

    isValidDate(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = value === null || value === undefined;

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( !isEmpty && typeof value === 'string' && dayjs( value )
            .isValid() ) {
            return this.ok();
        }

        if( !isEmpty && typeof value === 'number' && dayjs( value )
            .isValid() ) {
            return this.ok();
        }

        if( !isEmpty && isDate( value ) ) {
            return this.ok();
        }

        return this.fail( propertyName, ValidationRulesEnum.IsValidDate, customErr || `${ String( propertyName ) } is not a valid date`, cb );
    }

    isFutureDate(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const dateValidation = ValidationChain.validate<T>()
                                              .isValidDate( value, propertyName, isOptional, customErr, cb );
        if( dateValidation.getResult().isFailed ) {
            return dateValidation;
        }

        if( valueIsEmpty( value ) && isOptional ) {
            return this.ok();
        }

        if( dayjs( value )
            .toDate() > new Date() ) {
            return this.ok();
        }

        return this.fail( propertyName, ValidationRulesEnum.IsFutureDate, customErr || `${ String( propertyName ) } is not a future date`, cb );
    }

    isValidDateWithFormat(
        value: string | null | undefined,
        format: string,
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        const isEmpty: boolean = value === null || value === undefined;

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( !isEmpty && dayjs( value, format, true )
            .isValid() ) {
            return this.ok();
        }

        return this.fail( propertyName, ValidationRulesEnum.IsValidDate, customErr || `${ String( propertyName ) } is not a valid date`, cb );
    }

    isValidDateInterval(
        from: AnyDate,
        to: AnyDate,
        fromPropertyName: Partial<keyof T>,
        toPropertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        const isEmpty = valueIsEmpty( from ) && valueIsEmpty( to );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        const validDates = ValidationChain.validate<any>()
                                          .isValidDate( from, 'from', true )
                                          .isValidDate( to, 'to', true )
                                          .getResult();

        if( validDates.isFailed ) {
            return this.fail( fromPropertyName, ValidationRulesEnum.IsValidDateInterval, customErr || validDates.errors, cb );
        }

        if( validDates.isSuccessful ) {
            const now = new Date();
            const fromDate = valueIsEmpty( from )
                             ? dayjs( now )
                                 .add( -1, 'ms' )
                             : dayjs( from );
            const toDate = valueIsEmpty( to )
                           ? dayjs( fromDate )
                               .add( 1, 'ms' )
                           : dayjs( to );

            const validInterval = fromDate.isSame( toDate, 'ms' ) || fromDate.isBefore( toDate, 'ms' );

            if( validInterval ) {
                return this.ok();
            }
        }

        const error: IException[] = [
            {
                name   : ValidationRulesEnum.IsValidDateInterval,
                message: `${ String( fromPropertyName ) } is not a valid date interval`,
                field  : fromPropertyName as string
            },
            { name: 'IsValidDateInterval', message: `${ String( toPropertyName ) } is not a valid date interval`, field: toPropertyName as string }
        ];

        return this.fail( fromPropertyName, ValidationRulesEnum.IsValidDateInterval, customErr || error, cb );
    }

    isNumber(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        if( isNil( value ) && isOptional ) {
            return this.ok();
        }

        const isEmpty: boolean = isNil( value );

        if( isEmpty || !isNumber( Number( value ) ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsNumber, customErr || `${ String( propertyName ) } is not a number`, cb );
        }

        return this.ok();
    }

    isBoolean(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = isNil( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isBoolean( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsBoolean, customErr || `${ String( propertyName ) } is not a boolean value`, cb );
        }

        return this.ok();
    }

    isUUIDv4(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isUUID( value, '4' ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsUUIDv4, customErr || `${ String( propertyName ) } is not a uuid v4 value`, cb );
        }

        return this.ok();
    }

    isUUIDv4List(value: any[] | undefined, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isArray( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsList, customErr || `${ String( propertyName ) } is not a list`, cb );
        }

        for( let item of value! ) {
            if( isEmpty || !isUUID( item, '4' ) ) {
                return this.fail( propertyName, ValidationRulesEnum.IsUUIDv4List, customErr || `${ String( propertyName ) } is not a valid uuid v4 list`, cb );
            }
        }

        return this.ok();
    }

    isValid(validationFn: () => boolean | null, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const validationResult = validationFn();

        if( valueIsEmpty( validationResult ) && isOptional ) {
            return this.ok();
        }

        if( !validationResult ) {
            return this.fail( propertyName, ValidationRulesEnum.IsValid, customErr ?? `${ String( propertyName ) } is not a valid value`, cb );
        }

        return this.ok();
    }

    isEnum(
        value: string | number | null | undefined,
        enumType: Object,
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        if( isNil( value ) && isOptional ) {
            return this.ok();
        }

        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty || !Object.values( enumType )
                              .includes( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsValidEnum, customErr || `${ String( propertyName ) } is not a valid enum`, cb );
        }

        return this.ok();
    }

    isEnumList(
        valueList: (string | number | null | undefined)[] | undefined,
        enumType: Object,
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( valueList );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty ) {
            return this.fail( propertyName, ValidationRulesEnum.IsList, customErr || `${ String( propertyName ) } is not a list`, cb );
        }

        for( const value of valueList! ) {
            const validation = this.isEnum( value, enumType, propertyName, isOptional, customErr, cb )
                                   .getResult();

            if( validation.isFailed ) {
                return this.fail( propertyName, ValidationRulesEnum.IsEnumList, customErr || `${ String( propertyName ) } is not a valid enum list`, cb );
            }
        }

        return this.ok();
    }

    isOneOfEnums(
        value: string | null | undefined,
        enumTypeList: Object[],
        propertyName: Partial<keyof T>,
        isOptional = false,
        customErr?: IException,
        cb?: ValidationErrorHandler
    ): ValidationChain<T> {
        for( const enumType of enumTypeList ) {
            const result = ValidationChain.validate<any>()
                                          .isEnum( value, enumType, propertyName, isOptional, customErr, cb )
                                          .getResult();
            if( result.isSuccessful ) {
                return this.ok();
            }
        }

        return this.fail( propertyName, ValidationRulesEnum.IsValidEnum, customErr || `${ String( propertyName ) } is not a valid enum`, cb );
    }

    isPassword(value: string | null, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty ) {
            return this.fail( propertyName, ValidationRulesEnum.IsPassword, customErr || `${ String( propertyName ) } is not a valid password`, cb );
        }

        if( value!.trim().length < 8 ) {
            return this.fail( propertyName, ValidationRulesEnum.IsPassword, customErr || `${ String( propertyName ) } is not a valid password`, cb );
        }

        return this.ok();
    }

    isUint8Array(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isUint8Array( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsUint8Array, customErr || `${ String( propertyName ) } is not an Uint8Array`, cb );
        }

        return this.ok();
    }

    isBuffer(value: any, propertyName: Partial<keyof T>, isOptional = false, customErr?: IException, cb?: ValidationErrorHandler): ValidationChain<T> {
        const isEmpty: boolean = valueIsEmpty( value );

        if( isEmpty && isOptional ) {
            return this.ok();
        }

        if( isEmpty || !isBuffer( value ) ) {
            return this.fail( propertyName, ValidationRulesEnum.IsBuffer, customErr || `${ String( propertyName ) } is not a buffer`, cb );
        }

        return this.ok();
    }

    getResult(): Result<any> {
        return this._result;
    }

    private ok(): ValidationChain<T> {
        this._result = Result.aggregateResults( this._result, Success() );
        return this;
    }

    private fail(propertyName: Partial<keyof T>, rule: ValidationRulesEnum, error: string | IException | IException[], cb?: ValidationErrorHandler): ValidationChain<T> {
        let errors: IException[] = [];

        if( typeof error === 'string' ) {
            errors = mergeArray<IException>( errors, { name: rule, message: error, field: propertyName as string } );
        } else {
            errors = mergeArray<IException>( errors, error );
        }

        this._result = Result.aggregateResults( this._result, Failed( ...errors ) );

        if( isFunction( cb ) ) {
            cb( ...errors );
        }

        return this;
    }

    private areEqual(val: any, to: any, ignoreCase = true): boolean {
        val = val && typeof val === 'string' && ignoreCase
              ? val.trim()
                   .toLowerCase()
              : val;
        to = to && typeof to === 'string' && ignoreCase
             ? to.trim()
                 .toLowerCase()
             : to;
        return val === to;
    }
}
