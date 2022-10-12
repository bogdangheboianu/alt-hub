import { AuditEntity } from '@shared/entities/audit.entity';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IAudit } from '@shared/interfaces/audit/audit.interface';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Result } from '@shared/models/generics/result';
import { Counter } from '@shared/models/numerical/counter';
import { OptionalUserId } from '@users/models/optional-user-id';
import { UserId } from '@users/models/user-id';

export class Audit implements IDomainModel<Audit, AuditEntity> {
    createdAt: MandatoryDate;
    createdBy: OptionalUserId;
    updatedAt: OptionalDate;
    updatedBy: OptionalUserId;
    version: Counter;

    private constructor(data: IAudit) {
        this.createdAt = data.createdAt ?? MandatoryDate.now();
        this.createdBy = data.createdBy ?? OptionalUserId.empty();
        this.updatedAt = data.updatedAt ?? OptionalDate.empty();
        this.updatedBy = data.updatedBy ?? OptionalUserId.empty();
        this.version = data.version ?? Counter.one();
    }

    static initial(createdBy?: UserId): Audit {
        return new Audit( { createdBy: OptionalUserId.fromEntityId( createdBy ) } );
    }

    static fromEntity(entity: AuditEntity): Result<Audit> {
        const data = Result.aggregateObjects<IAudit>(
            { createdAt: MandatoryDate.create( entity.createdAt, 'createdAt' ) },
            { createdBy: OptionalUserId.create( entity.createdBy, 'createdBy' ) },
            { updatedAt: OptionalDate.create( entity.updatedAt, 'updatedAt' ) },
            { updatedBy: OptionalUserId.create( entity.updatedBy, 'updatedBy' ) },
            { version: Counter.create( entity.version, 'version' ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Audit( data.value! ) );
    }

    equals(to: Audit): boolean {
        return this.version.equals( to.version );
    }

    toEntity(): AuditEntity {
        return entityFactory( AuditEntity, {
            createdAt: this.createdAt.getValue(),
            createdBy: this.createdBy.getValue(),
            updatedAt: this.updatedAt.getValue(),
            updatedBy: this.updatedBy.getValue(),
            version  : this.version.getValue()
        } );
    }

    update(updatedBy?: UserId): Audit {
        return new Audit(
            {
                ...this,
                updatedAt: this.updatedAt.updateToNow(),
                updatedBy: OptionalUserId.fromEntityId( updatedBy ),
                version  : this.version.increment()
            } );
    }
}
