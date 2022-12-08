import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { CompanyEntity } from '@company/entities/company.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { MoneyEntity } from '@shared/entities/money.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity( 'company_pricing_profiles' )
export class CompanyPricingProfileEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Varchar, nullable: false, unique: true } )
    name!: string;

    @ManyToOne( () => CompanyPositionEntity, { eager: true, nullable: false } )
    @JoinColumn( { name: 'company_position_id', referencedColumnName: 'id' } )
    position!: CompanyPositionEntity;

    @Column( () => MoneyEntity )
    hourlyRate!: MoneyEntity;

    @ManyToOne( () => CompanyEntity, company => company.pricingProfiles, { lazy: true } )
    @JoinColumn( { name: 'company_id', referencedColumnName: 'id' } )
    company?: Promise<CompanyEntity>;
}
