import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class OptionalPositiveNumber implements IValueObject<OptionalPositiveNumber, number | null> {
    private readonly value: number | null;

    private constructor(value?: number) {
        this.value = value ?? null;
    }

    static empty(): OptionalPositiveNumber {
        return new OptionalPositiveNumber();
    }

    static ofUnchecked(value: number): OptionalPositiveNumber {
        return new OptionalPositiveNumber( value );
    }

    static create(value: number | null | undefined, propertyName: string): Result<OptionalPositiveNumber> {
        if( valueIsEmpty( value ) ) {
            return Success( this.empty() );
        }

        const validation = ValidationChain.validate<any>()
                                          .isNumber( value, propertyName )
                                          .isGreaterThan( value, 0, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new OptionalPositiveNumber( value ) );
    }

    getValue(): number | null {
        return this.value;
    }

    equals(to: OptionalPositiveNumber): boolean {
        return this.value === to.getValue();
    }

    isSet(): boolean {
        return this.value !== null;
    }

    update(value: number | null | undefined, propertyName: string): Result<OptionalPositiveNumber> {
        return OptionalPositiveNumber.create( value, propertyName );
    }
}
