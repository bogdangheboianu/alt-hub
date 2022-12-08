import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class FileMimeType implements IValueObject<FileMimeType, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): Result<FileMimeType> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( value, 'mimeType' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new FileMimeType( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: FileMimeType): boolean {
        return this.value === to.getValue();
    }
}
