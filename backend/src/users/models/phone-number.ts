import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class PhoneNumber implements IValueObject<PhoneNumber, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value.trim()
                          .toLowerCase();
    }

    static create(value: string, propertyName = 'phone'): Result<PhoneNumber> {
        const validation = ValidationChain.validate<any>()
                                          .isPhone( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new PhoneNumber( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: PhoneNumber): boolean {
        return this.value === to.getValue();
    }

    update(value: string, propertyName = 'phone'): Result<PhoneNumber> {
        return PhoneNumber.create( value, propertyName );
    }
}
