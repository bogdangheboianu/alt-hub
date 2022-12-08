import { countWords } from '@shared/functions/count-words.function';
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

        return Success( new FullName( firstName.trim(), lastName.trim() ) );
    }

    static fromJoined(value: string, propertyName: string): Result<FullName> {
        const space = ' ';
        const validation = ValidationChain.validate<any>()
                                          .hasMinimumWords( value, 2, space, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        if( countWords( value, space ) === 2 ) {
            const [ firstName, lastName ] = value.trim()
                                                 .split( space );
            return FullName.create( firstName, lastName );
        }

        const separated = value.trim()
                               .split( space );
        const firstName = separated.shift();
        const lastNames = separated.join( space );

        return FullName.create( firstName!, lastNames );
    }

    getValue(): IFullName {
        return this.value;
    }

    equals(to: FullName): boolean {
        return this.value.firstName.toLowerCase() === to.getValue()
                                                        .firstName
                                                        .toLowerCase() && this.value.lastName.toLowerCase() === to.getValue()
                                                                                                                  .lastName
                                                                                                                  .toLowerCase();
    }

    update(firstName: string, lastName: string): Result<FullName> {
        return FullName.create( firstName, lastName );
    }
}
