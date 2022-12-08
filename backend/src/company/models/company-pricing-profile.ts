import { CreateCompanyPricingProfileCommand } from '@company/commands/impl/create-company-pricing-profile.command';
import { CompanyPricingProfileEntity } from '@company/entities/company-pricing-profile.entity';
import { ICompanyPricingProfile } from '@company/interfaces/company-pricing-profile.interface';
import { CompanyPosition } from '@company/models/company-position';
import { CompanyPricingProfileId } from '@company/models/company-pricing-profile-id';
import { CompanyPricingProfileName } from '@company/models/company-pricing-profile-name';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { Money } from '@shared/models/money/money';

export class CompanyPricingProfile implements IDomainModel<CompanyPricingProfile, CompanyPricingProfileEntity> {
    id: CompanyPricingProfileId;
    name: CompanyPricingProfileName;
    position: CompanyPosition;
    hourlyRate: Money;
    audit: Audit;

    private constructor(data: ICompanyPricingProfile) {
        this.id = data.id ?? CompanyPricingProfileId.generate();
        this.name = data.name;
        this.position = data.position;
        this.hourlyRate = data.hourlyRate;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateCompanyPricingProfileCommand, companyPosition: CompanyPosition): Result<CompanyPricingProfile> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<ICompanyPricingProfile, 'name' | 'position' | 'hourlyRate' | 'audit'>>(
            { name: CompanyPricingProfileName.create( payload.name ) },
            { position: companyPosition },
            { hourlyRate: Money.create( payload.hourlyRate.amount, payload.hourlyRate.currency, false ) },
            { audit: Audit.initial( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new CompanyPricingProfile( data.value! ) );
    }

    static fromEntity(entity: CompanyPricingProfileEntity): Result<CompanyPricingProfile> {
        const data = Result.aggregateObjects<ICompanyPricingProfile>(
            { id: CompanyPricingProfileId.create( entity.id, 'id' ) },
            { name: CompanyPricingProfileName.create( entity.name ) },
            { position: CompanyPosition.fromEntity( entity.position ) },
            { hourlyRate: Money.create( entity.hourlyRate.amount, entity.hourlyRate.currency, true ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new CompanyPricingProfile( data.value! ) );
    }

    equals(to: CompanyPricingProfile): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): CompanyPricingProfileEntity {
        return entityFactory( CompanyPricingProfileEntity, {
            id        : this.id.getValue(),
            name      : this.name.getValue(),
            position  : this.position.toEntity(),
            hourlyRate: this.hourlyRate.getValue(),
            audit     : this.audit.toEntity()
        } );
    }
}
