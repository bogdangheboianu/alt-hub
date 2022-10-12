import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { IFullName } from '@users/interfaces/full-name.interface';

export class FullName implements IValueObject<FullName, IFullName> {
    private readonly value: IFullName;

    private constructor(firstName: string, lastName: string) {
        this.value = {
            firstName: firstName.trim(),
            lastName : lastName.trim()
        };
    }

    get firstName(): string {
        return this.value.firstName;
    }

    get lastName(): string {
        return this.value.lastName;
    }

    get joined(): string {
        return `${ this.lastName } ${ this.firstName }`;
    }

    static create(firstName: string, lastName: string): Result<FullName> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( firstName, 'firstName' )
                                          .hasMaximumLength( firstName, 100, 'firstName' )
                                          .isNotEmpty( lastName, 'lastName' )
                                          .hasMaximumLength( lastName, 100, 'lastName' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new FullName( firstName, lastName ) );
    }

    getValue(): IFullName {
        return this.value;
    }

    equals(to: FullName): boolean {
        return this.value.firstName === to.getValue().firstName && this.value.lastName === to.getValue().lastName;
    }

    update(firstName: string, lastName: string): Result<FullName> {
        return FullName.create( firstName, lastName );
    }
}
