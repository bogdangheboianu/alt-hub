import { CreateCompanyPositionCommand } from '@company/commands/impl/create-company-position.command';
import { CreateCompanyPricingProfileCommand } from '@company/commands/impl/create-company-pricing-profile.command';
import { CompanyEntity } from '@company/entities/company.entity';
import { CompanyPositionNotFoundException, DuplicateCompanyPositionNameException } from '@company/exceptions/company-position.exceptions';
import { DuplicateCompanyPricingProfileNameException, NotEnoughDataForCompanyPricingProfileException } from '@company/exceptions/company-pricing-profile.exceptions';
import { ICompany } from '@company/interfaces/company.interface';
import { CompanyId } from '@company/models/company-id';
import { CompanyName } from '@company/models/company-name';
import { CompanyPosition } from '@company/models/company-position';
import { CompanyPositionId } from '@company/models/company-position-id';
import { CompanyPositionName } from '@company/models/company-position-name';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { CompanyPricingProfileName } from '@company/models/company-pricing-profile-name';
import { FiscalYear } from '@fiscal/models/fiscal-year';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { maxBy } from 'lodash';

export class Company implements IDomainModel<Company, CompanyEntity> {
    id: CompanyId;
    name: CompanyName;
    positions: CompanyPosition[];
    fiscalYears: FiscalYear[];
    pricingProfiles: CompanyPricingProfile[];
    audit: Audit;

    private constructor(data: ICompany) {
        this.id = data.id ?? CompanyId.generate();
        this.name = data.name;
        this.positions = data.positions ?? [];
        this.fiscalYears = data.fiscalYears ?? [];
        this.pricingProfiles = data.pricingProfiles ?? [];
        this.audit = data.audit ?? Audit.initial();
    }

    static fromEntity(entity: CompanyEntity): Result<Company> {
        const buildData = Result.aggregateObjects<ICompany>(
            { id: CompanyId.create( entity.id ) },
            { name: CompanyName.create( entity.name, 'name' ) },
            { positions: Result.aggregateResults( ...entity.positions.map( p => CompanyPosition.fromEntity( p ) ) ) },
            { fiscalYears: Result.aggregateResults( ...entity.fiscalYears.map( fy => FiscalYear.fromEntity( fy ) ) ) },
            { pricingProfiles: Result.aggregateResults( ...entity.pricingProfiles.map( fy => CompanyPricingProfile.fromEntity( fy ) ) ) },
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
            id             : this.id.getValue(),
            name           : this.name.getValue(),
            positions      : this.positions.map( p => p.toEntity() ),
            fiscalYears    : this.fiscalYears.map( fy => fy.toEntity() ),
            pricingProfiles: this.pricingProfiles.map( fy => fy.toEntity() ),
            audit          : this.audit.toEntity()
        } );
    }

    getLastCreatedPosition(): CompanyPosition | null {
        if( valueIsEmpty( this.positions ) ) {
            return null;
        }

        return maxBy( this.positions, position => position.audit.createdAt.getValue() )!;
    }

    getLastCreatedPricingProfile(): CompanyPricingProfile | null {
        if( valueIsEmpty( this.pricingProfiles ) ) {
            return null;
        }

        return maxBy( this.pricingProfiles, pricingProfile => pricingProfile.audit.createdAt.getValue() )!;
    }

    addPosition(command: CreateCompanyPositionCommand): Result<Company> {
        const position = CompanyPosition.create( command );

        if( position.isFailed ) {
            return Failed( ...position.errors );
        }

        if( this.hasPositionByName( position.value!.name ) ) {
            return Failed( new DuplicateCompanyPositionNameException() );
        }

        return Success(
            new Company( {
                             ...this,
                             positions: [ ...this.positions, position.value! ],
                             audit    : this.audit.update( command.data.context.user?.id )
                         } )
        );
    }

    addPricingProfile(command: CreateCompanyPricingProfileCommand): Result<Company> {
        const companyPosition = this.getOrCreatePositionForPricingProfile( command );

        if( companyPosition.isFailed ) {
            return Failed( ...companyPosition.errors );
        }

        const pricingProfile = CompanyPricingProfile.create( command, companyPosition.value! );

        if( pricingProfile.isFailed ) {
            return Failed( ...pricingProfile.errors );
        }

        if( this.hasPricingProfileByName( pricingProfile.value!.name ) ) {
            return Failed( new DuplicateCompanyPricingProfileNameException() );
        }

        return Success(
            new Company( {
                             ...this,
                             pricingProfiles: [ ...this.pricingProfiles, pricingProfile.value! ],
                             audit          : this.audit.update( command.data.context.user?.id )
                         } )
        );
    }

    private hasPositionByName(positionName: CompanyPositionName): boolean {
        return this.positions.some( p => p.name.equals( positionName ) );
    }

    private hasPricingProfileByName(pricingProfileName: CompanyPricingProfileName): boolean {
        return this.pricingProfiles.some( pp => pp.name.equals( pricingProfileName ) );
    }

    private getPositionById(id: CompanyPositionId): CompanyPosition | null {
        return this.positions.find( p => p.id.equals( id ) ) ?? null;
    }

    private getOrCreatePositionForPricingProfile(command: CreateCompanyPricingProfileCommand): Result<CompanyPosition> {
        const { payload: { positionName, positionId } } = command.data;

        if( valueIsEmpty( positionId ) && valueIsEmpty( positionName ) ) {
            return Failed( new NotEnoughDataForCompanyPricingProfileException() );
        }

        if( valueIsNotEmpty( positionId ) ) {
            const companyPositionId = CompanyPositionId.create( positionId, 'positionId' );

            if( companyPositionId.isFailed ) {
                return Failed( ...companyPositionId.errors );
            }

            const position = this.getPositionById( companyPositionId.value! );
            return valueIsEmpty( position )
                   ? Failed( new CompanyPositionNotFoundException() )
                   : Success( position );
        }

        return CompanyPosition.fromName( command, positionName! );
    }
}
