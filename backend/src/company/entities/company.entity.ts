import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity( 'companies' )
export class CompanyEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Varchar } )
    name!: string;

    @OneToMany( () => CompanyPositionEntity, position => position.company, { eager: true, cascade: true } )
    positions!: CompanyPositionEntity[];
}
