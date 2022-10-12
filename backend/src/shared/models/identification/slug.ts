import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class Slug implements IValueObject<Slug, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string, propertyName = 'slug'): Result<Slug> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new Slug( value.trim() ) );
    }

    static fromName(name: string, propertyName = 'slug'): Result<Slug> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( name, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        const slugValue = name.trim()
                              .toLowerCase()
                              .split( ' ' )
                              .join( '_' );

        return Success( new Slug( slugValue ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: Slug): boolean {
        return this.value === to.getValue();
    }
}
