import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { EmailAddress } from '@users/models/email-address';

export class Username implements IValueObject<Username, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value.trim()
                          .toLowerCase();
    }

    static create(value: string): Result<Username> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( value, 'username' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new Username( value ) );
    }

    static fromEmail(email: EmailAddress): Username {
        const value = email.getValue()
                           .split( '@' )[0];
        return new Username( value );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: Username): boolean {
        return this.value === to.getValue();
    }
}
