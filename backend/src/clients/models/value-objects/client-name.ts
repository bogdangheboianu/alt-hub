import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class ClientName implements IValueObject<ClientName, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value.trim();
    }

    static create(value: string, propertyName = 'name'): Result<ClientName> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new ClientName( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: ClientName): boolean {
        return this.value === to.getValue();
    }

    update(value: string, propertyName: string = 'name'): Result<ClientName> {
        return ClientName.create( value, propertyName );
    }
}
