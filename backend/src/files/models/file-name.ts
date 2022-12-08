import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class FileName implements IValueObject<FileName, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value.trim()
                          .toLowerCase()
                          .replace( ' ', '_' );
    }

    static create(value: string): Result<FileName> {
        const validation = ValidationChain.validate<any>()
                                          .hasMaximumLength( value, 200, 'name' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new FileName( value ?? undefined ) );
    }

    update(value: string): Result<FileName> {
        return FileName.create( value );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: FileName): boolean {
        return this.value === to.getValue();
    }
}
