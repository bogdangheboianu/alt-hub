import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class VacationReason implements IValueObject<VacationReason, string | null> {
    private readonly value: string | null;

    private constructor(value?: string) {
        this.value = value?.trim() ?? null;
    }

    static empty(): VacationReason {
        return new VacationReason();
    }

    static create(value?: string | null): Result<VacationReason> {
        const validation = ValidationChain.validate<any>()
                                          .hasMaximumLength( value, 200, 'reason', true )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new VacationReason( value ?? undefined ) );
    }

    isEmpty(): boolean {
        return valueIsEmpty( this.value );
    }

    getValue(): string | null {
        return this.value;
    }

    equals(to: VacationReason): boolean {
        return this.value === to.getValue();
    }
}
