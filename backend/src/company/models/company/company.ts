import { AddPositionToCompanyCommand } from '@company/commands/impl/position/add-position-to-company.command';
import { CompanyEntity } from '@company/entities/company.entity';
import { DuplicateCompanyPositionNameException } from '@company/exceptions/company-position.exceptions';
import { ICompany } from '@company/interfaces/company.interface';
import { CompanyPosition } from '@company/models/position/company-position';
import { CompanyId } from '@company/models/company/company-id';
import { CompanyName } from '@company/models/company/company-name';
import { CompanyPositionName } from '@company/models/position/company-position-name';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { maxBy } from 'lodash';

export class Company implements IDomainModel<Company, CompanyEntity> {
    id: CompanyId;
    name: CompanyName;
    positions: CompanyPosition[];
    audit: Audit;

    private constructor(data: ICompany) {
        this.id = data.id ?? CompanyId.generate();
        this.name = data.name;
        this.positions = data.positions ?? [];
        this.audit = data.audit ?? Audit.initial();
    }

    static fromEntity(entity: CompanyEntity): Result<Company> {
        const buildData = Result.aggregateObjects<ICompany>(
            { id: CompanyId.create( entity.id ) },
            { name: CompanyName.create( entity.name, 'name' ) },
            { positions: Result.aggregateResults( ...entity.positions.map( p => CompanyPosition.fromEntity( p ) ) ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new Company( buildData.value! ) );
    }

    equals(to: Company): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): CompanyEntity {
        return entityFactory( CompanyEntity, {
            id       : this.id.getValue(),
            name     : this.name.getValue(),
            positions: this.positions.map( p => p.toEntity() ),
            audit    : this.audit.toEntity()
        } );
    }

    getLastCreatedPosition(): CompanyPosition | null {
        if( valueIsEmpty( this.positions ) ) {
            return null;
        }

        return maxBy( this.positions, position => position.audit.createdAt.getValue() )!;
    }

    addPosition(command: AddPositionToCompanyCommand, position: CompanyPosition): Result<Company> {
        const { name } = command.data.payload;
        const companyPositionName = CompanyPositionName.create( name, 'name' );

        if( companyPositionName.isFailed ) {
            return Failed( ...companyPositionName.errors );
        }

        if( this.hasPositionByName( companyPositionName.value! ) ) {
            return Failed( new DuplicateCompanyPositionNameException() );
        }

        return Success(
            new Company( {
                             ...this,
                             positions: [ ...this.positions, position ],
                             audit    : this.audit.update( command.data.context.user?.id )
                         } )
        );
    }

    private hasPositionByName(positionName: CompanyPositionName): boolean {
        return this.positions.some( p => p.name.equals( positionName ) );
    }
}
