import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { CompanyPricingProfileEntity } from '@company/entities/company-pricing-profile.entity';
import { FiscalYearEntity } from '@fiscal/entities/fiscal-year.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity( 'companies' )
export class CompanyEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Varchar, nullable: false } )
    name!: string;

    @OneToMany( () => CompanyPositionEntity, position => position.company, { eager: true, cascade: true, onDelete: 'CASCADE' } )
    positions!: CompanyPositionEntity[];

    @OneToMany( () => FiscalYearEntity, fiscalYear => fiscalYear.company, { eager: true, cascade: true, onDelete: 'CASCADE' } )
    fiscalYears!: FiscalYearEntity[];

    @OneToMany( () => CompanyPricingProfileEntity, pricingProfile => pricingProfile.company, { eager: true, cascade: true, onDelete: 'CASCADE' } )
    pricingProfiles!: CompanyPricingProfileEntity[];
}
