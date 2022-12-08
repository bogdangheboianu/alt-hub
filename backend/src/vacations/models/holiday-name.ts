import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class HolidayName implements IValueObject<HolidayName, string> {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value?.trim();
    }

    static create(value: string): Result<HolidayName> {
        const validation = ValidationChain.validate<any>()
                                          .hasMaximumLength( value, 200, 'name' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new HolidayName( value ?? undefined ) );
    }

    update(value: string): Result<HolidayName> {
        return HolidayName.create( value );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: HolidayName): boolean {
        return this.value === to.getValue();
    }
}
