import { FiscalYearEntity } from '@fiscal/entities/fiscal-year.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserEntity } from '@users/entities/user.entity';
import { VacationEntity } from '@vacations/entities/vacation.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity( 'annual_employee_sheets' )
export class AnnualEmployeeSheetEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Int, nullable: false } )
    paidLeaveDays!: number;

    @Column( { type: ColTypesEnum.Int, nullable: false } )
    remainingPaidLeaveDays!: number;

    @ManyToOne( () => UserEntity, user => user.annualSheets, { eager: true } )
    @JoinColumn( { name: 'user_id', referencedColumnName: 'id' } )
    user!: UserEntity;

    @OneToMany( () => VacationEntity, vacation => vacation.annualEmployeeSheet, { lazy: true, cascade: true } )
    vacations?: Promise<VacationEntity[]>;

    @ManyToOne( () => FiscalYearEntity, fiscalYear => fiscalYear.annualEmployeeSheets, { lazy: true } )
    @JoinColumn( { name: 'fiscal_year_id', referencedColumnName: 'id' } )
    fiscalYear?: Promise<FiscalYearEntity>;

    @Column( { type: ColTypesEnum.UUID, name: 'fiscal_year_id' } )
    fiscalYearId!: string;
}
