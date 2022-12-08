import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class FileBuffer implements IValueObject<FileBuffer, Buffer> {
    private readonly value: Buffer;

    private constructor(value: Buffer) {
        this.value = value;
    }

    static create(value: Buffer, propertyName: string = 'buffer'): Result<FileBuffer> {
        const validation = ValidationChain.validate<any>()
                                          .isBuffer( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new FileBuffer( value ) );
    }

    static fromUInt8Array(value: Uint8Array, propertyName: string = 'buffer'): Result<FileBuffer> {
        const validation = ValidationChain.validate<any>()
                                          .isUint8Array( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new FileBuffer( Buffer.from( value ) ) );
    }

    getValue(): Buffer {
        return this.value;
    }

    equals(to: FileBuffer): boolean {
        return this.value === to.getValue();
    }
}
