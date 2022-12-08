import { AnnualEmployeeSheetEntity } from '@fiscal/entities/annual-employee-sheet.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { AccountEntity } from '@users/entities/account.entity';
import { EmploymentInfoEntity } from '@users/entities/employment-info.entity';
import { PersonalInfoEntity } from '@users/entities/personal-info.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity( { name: 'users' } )
export class UserEntity extends BaseEntity {
    @Column( () => AccountEntity )
    account!: AccountEntity;

    @Column( () => PersonalInfoEntity )
    personalInfo!: PersonalInfoEntity;

    @Column( () => EmploymentInfoEntity )
    employmentInfo!: EmploymentInfoEntity;

    @OneToMany( () => AnnualEmployeeSheetEntity, sheet => sheet.user, { lazy: true, cascade: true } )
    annualSheets?: Promise<AnnualEmployeeSheetEntity[]>;
}
