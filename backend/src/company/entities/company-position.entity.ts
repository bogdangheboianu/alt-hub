import { CompanyEntity } from '@company/entities/company.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserEntity } from '@users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity( 'company_positions' )
export class CompanyPositionEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    name!: string;

    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    slug!: string;

    @OneToMany( () => UserEntity, user => user.employeeInfo.companyPosition, { lazy: true } )
    users?: Promise<UserEntity[]>;

    @ManyToOne( () => CompanyEntity, company => company.positions, { lazy: true } )
    @JoinColumn( { name: 'company_id', referencedColumnName: 'id' } )
    company?: Promise<CompanyEntity>;
}
