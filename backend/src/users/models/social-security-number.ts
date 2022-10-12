import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class SocialSecurityNumber implements IValueObject<SocialSecurityNumber, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value.trim();
    }

    static create(value: string, propertyName: string = 'ssn'): Result<SocialSecurityNumber> {
        const validation = ValidationChain.validate<any>()
                                          .hasLengthEqualTo( value, 13, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new SocialSecurityNumber( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: SocialSecurityNumber): boolean {
        return this.value === to.getValue();
    }

    update(value: string, propertyName = 'ssn'): Result<SocialSecurityNumber> {
        return SocialSecurityNumber.create( value, propertyName );
    }
}
