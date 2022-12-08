import { CompanyEntity } from '@company/entities/company.entity';
import { AnnualEmployeeSheetEntity } from '@fiscal/entities/annual-employee-sheet.entity';
import { FiscalYearTypeEnum } from '@fiscal/enums/fiscal-year-type.enum';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity( 'fiscal_years' )
export class FiscalYearEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Enum, enum: FiscalYearTypeEnum, nullable: false } )
    type!: FiscalYearTypeEnum;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: false } )
    startDate!: Date;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: false } )
    endDate!: Date;

    @OneToMany( () => AnnualEmployeeSheetEntity, userSheet => userSheet.fiscalYear, { eager: true, cascade: true } )
    annualEmployeeSheets!: AnnualEmployeeSheetEntity[];

    @ManyToOne( () => CompanyEntity, company => company.fiscalYears, { lazy: true } )
    @JoinColumn( { name: 'company_id', referencedColumnName: 'id' } )
    company?: Promise<CompanyEntity>;
}
