import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class EmailAddress implements IValueObject<EmailAddress, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value.trim()
                          .toLowerCase();
    }

    static create(value: string, propertyName = 'email'): Result<EmailAddress> {
        const validation = ValidationChain.validate<any>()
                                          .isEmail( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new EmailAddress( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: EmailAddress): boolean {
        return this.value === to.getValue();
    }

    update(value: string, propertyName = 'email'): Result<EmailAddress> {
        return EmailAddress.create( value, propertyName );
    }
}
