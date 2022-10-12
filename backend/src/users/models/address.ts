import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class Address implements IValueObject<Address, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value.trim();
    }

    static create(value: string, propertyName: string = 'address'): Result<Address> {
        const validation = ValidationChain.validate<any>()
                                          .hasMinimumLength( value, 10, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new Address( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: Address): boolean {
        return this.value === to.getValue();
    }

    update(value: string, propertyName: string = 'address'): Result<Address> {
        return Address.create( value, propertyName );
    }
}
