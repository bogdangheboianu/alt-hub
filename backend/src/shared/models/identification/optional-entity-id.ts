import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { EntityId } from '@shared/models/identification/entity-id';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class OptionalEntityId implements IValueObject<OptionalEntityId, string | null> {
    private readonly value: string | null;

    protected constructor(value?: string) {
        this.value = value ?? null;
    }

    static empty(): OptionalEntityId {
        return new OptionalEntityId();
    }

    static fromEntityId(entityId?: EntityId): OptionalEntityId {
        return new OptionalEntityId( entityId?.getValue() );
    }

    static create(value: string | null, propertyName: string): Result<OptionalEntityId> {
        if( valueIsEmpty( value ) ) {
            return Success( this.empty() );
        }
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( value, propertyName )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new OptionalEntityId( value! ) );
    }

    getValue(): string | null {
        return this.value;
    }

    equals(to: OptionalEntityId | EntityId): boolean {
        return this.value === to.getValue();
    }

    isSet(): boolean {
        return valueIsNotEmpty( this.value );
    }
}
