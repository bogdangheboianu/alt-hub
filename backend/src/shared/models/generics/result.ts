import { Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';

export class Result<T> {
    private readonly _value: T | null;
    private readonly _errors: IException[];
    private readonly _isNotFound: boolean;
    private readonly _isSuccessful: boolean;

    private constructor(value: T | null = null, errors: IException[] = [], isNotFound = false, isSuccessful = false) {
        this._value = value;
        this._errors = errors;
        this._isNotFound = isNotFound;
        this._isSuccessful = isSuccessful;
    }

    get isSuccessful(): boolean {
        return this._isSuccessful;
    }

    get isFailed(): boolean {
        return !this._isSuccessful;
    }

    get isNotFound(): boolean {
        return this._isNotFound;
    }

    get value(): T | null {
        return this._value;
    }

    get errors(): IException[] {
        return this._errors;
    }

    static success<T>(value?: T): Result<T> {
        return new Result<T>( value, [], false, true );
    }

    static failed(...errors: IException[]): Result<any> {
        return new Result<void>( null, errors, false, false );
    }

    static notFound(): Result<any> {
        return new Result<void>( null, [], true, true );
    }

    static aggregateResults<T>(...results: Result<T>[]): Result<T[]> {
        if( valueIsEmpty( results ) ) {
            return Success( [] );
        }

        const values: T[] = [];
        let errors: IException[] = [];

        results.forEach( (result: Result<T>) => {
            if( result.isSuccessful ) {
                values.push( result.value! );
                return;
            }

            if( result.isFailed ) {
                errors = [ ...errors, ...result.errors ];
            }
        } );

        if( valueIsEmpty( values ) && valueIsEmpty( errors ) ) {
            return this.notFound();
        }

        if( valueIsNotEmpty( errors ) ) {
            return this.failed( ...errors );
        }

        return this.success( values ?? [] );
    }

    static aggregateObjects<T>(...objects: { [key in keyof T]?: Result<any> | any }[]): Result<T> {
        const value: any = {};
        let errors: IException[] = [];

        objects.forEach( (obj: { [key in keyof T]?: Result<any> | any }) => {
            const propertyName = Object.keys( obj )[0];

            if( valueIsEmpty( propertyName ) ) {
                return;
            }

            // @ts-ignore
            const propertyResult = obj[propertyName];

            if( propertyResult instanceof Result ) {
                if( propertyResult.isNotFound ) {
                    return;
                }

                if( propertyResult.isSuccessful ) {
                    value[propertyName] = propertyResult.value;
                    return;
                }

                if( propertyResult.isFailed ) {
                    errors = [ ...errors, ...propertyResult.errors ];
                }
            } else {
                value[propertyName] = propertyResult;
            }
        } );

        if( valueIsEmpty( value ) && valueIsEmpty( errors ) ) {
            return this.notFound();
        }

        if( valueIsNotEmpty( errors ) ) {
            return this.failed( ...errors );
        }

        return this.success( value as T );
    }
}
