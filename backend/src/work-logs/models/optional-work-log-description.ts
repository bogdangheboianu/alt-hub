import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class OptionalWorkLogDescription implements IValueObject<OptionalWorkLogDescription, string | null> {
    private readonly value: string | null;

    private constructor(value?: string) {
        this.value = value?.trim() ?? null;
    }

    static empty(): OptionalWorkLogDescription {
        return new OptionalWorkLogDescription();
    }

    static create(value: string | null | undefined, propertyName: string): Result<OptionalWorkLogDescription> {
        if( valueIsEmpty( value ) ) {
            return Success( this.empty() );
        }

        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( value, propertyName )
                                          .hasMaximumLength( value, 2000, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new OptionalWorkLogDescription( value ) );
    }

    getValue(): string | null {
        return this.value;
    }

    equals(to: OptionalWorkLogDescription): boolean {
        return this.value === to.getValue();
    }

    update(value: string | null | undefined, propertyName: string): Result<OptionalWorkLogDescription> {
        return OptionalWorkLogDescription.create( value, propertyName );
    }
}
