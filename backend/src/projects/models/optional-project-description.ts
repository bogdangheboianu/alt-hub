import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class OptionalProjectDescription implements IValueObject<OptionalProjectDescription, string | null> {
    private readonly value: string | null;

    private constructor(value?: string) {
        this.value = value?.trim() ?? null;
    }

    static create(value: string | null, propertyName = 'description'): Result<OptionalProjectDescription> {
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

        return Success( new OptionalProjectDescription( value ) );
    }

    static empty(): OptionalProjectDescription {
        return new OptionalProjectDescription();
    }

    equals(to: OptionalProjectDescription): boolean {
        return this.value === to.getValue();
    }

    getValue(): string | null {
        return this.value;
    }

}
