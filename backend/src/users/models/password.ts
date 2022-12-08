import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import * as bcrypt from 'bcrypt';

export class Password implements IValueObject<Password, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static hash(rawPassword: string, propertyName = 'password'): Result<Password> {
        const validation = ValidationChain.validate<any>()
                                          .isPassword( rawPassword, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync( saltRounds );
        const hash = bcrypt.hashSync( rawPassword, salt );

        return Success( new Password( hash ) );
    }

    static fromHash(hash: string): Result<Password> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( hash, 'password' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new Password( hash ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: Password): boolean {
        return this.value === to.getValue();
    }

    matches(rawPassword: string): boolean {
        return bcrypt.compareSync( rawPassword, this.value );
    }

    update(rawPassword: string, propertyName = 'password'): Result<Password> {
        return Password.hash( rawPassword, propertyName );
    }
}
