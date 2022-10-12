import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class CompanyPositionName implements IValueObject<CompanyPositionName, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string, propertyName: string): Result<CompanyPositionName> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new CompanyPositionName( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: CompanyPositionName): boolean {
        return this.value === to.getValue();
    }
}
