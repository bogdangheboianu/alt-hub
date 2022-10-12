import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { v4 as uuidv4 } from 'uuid';

export class EntityId implements IValueObject<EntityId, string> {
    private readonly value: string;

    protected constructor(value?: string) {
        this.value = valueIsEmpty( value )
                     ? uuidv4()
                     : value!;
    }

    static generate(): EntityId {
        return new EntityId();
    }

    static create(value: string, propertyName = 'id'): Result<EntityId> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new EntityId( value ) );
    }

    getValue(): string {
        return this.value;
    }

    equals(to: EntityId): boolean {
        return this.value === to.getValue();
    }
}
