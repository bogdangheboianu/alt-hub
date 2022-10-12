import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { Random } from 'random-js';

export class EmployeeId implements IValueObject<EmployeeId, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static generate(): EmployeeId {
        const random = new Random();
        const numericId = random.integer( 10000, 99999 );
        return new EmployeeId( `ALT${ numericId }` );
    }

    static create(value: string, propertyName: string = 'employeeId'): Result<EmployeeId> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new EmployeeId( value! ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: EmployeeId): boolean {
        return this.value === to.getValue();
    }
}
