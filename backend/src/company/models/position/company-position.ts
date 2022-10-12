import { AddPositionToCompanyCommand } from '@company/commands/impl/position/add-position-to-company.command';
import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { ICompanyPosition } from '@company/interfaces/company-position.interface';
import { CompanyPositionId } from '@company/models/position/company-position-id';
import { CompanyPositionName } from '@company/models/position/company-position-name';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { Slug } from '@shared/models/identification/slug';

export class CompanyPosition implements IDomainModel<CompanyPosition, CompanyPositionEntity> {
    id: CompanyPositionId;
    name: CompanyPositionName;
    slug: Slug;
    audit: Audit;

    private constructor(data: ICompanyPosition) {
        this.id = data.id ?? CompanyPositionId.generate();
        this.name = data.name;
        this.slug = data.slug ?? Slug.fromName( data.name.getValue() ).value!;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: AddPositionToCompanyCommand): Result<CompanyPosition> {
        const { context, payload } = command.data;
        const buildData = Result.aggregateObjects<Pick<ICompanyPosition, 'name' | 'audit'>>(
            { name: CompanyPositionName.create( payload.name, 'name' ) },
            { audit: Audit.initial( context.user?.id ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new CompanyPosition( buildData.value! ) );
    }

    static fromEntity(entity: CompanyPositionEntity): Result<CompanyPosition> {
        const buildData = Result.aggregateObjects<ICompanyPosition>(
            { id: CompanyPositionId.create( entity.id ) },
            { name: CompanyPositionName.create( entity.name, 'name' ) },
            { slug: Slug.create( entity.slug ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new CompanyPosition( buildData.value! ) );
    }

    equals(to: CompanyPosition): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): CompanyPositionEntity {
        return entityFactory( CompanyPositionEntity, {
            id   : this.id.getValue(),
            name : this.name.getValue(),
            slug : this.slug.getValue(),
            audit: this.audit.toEntity()
        } );
    }
}
