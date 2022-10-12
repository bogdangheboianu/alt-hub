import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, Entity } from 'typeorm';

@Entity( 'clients' )
export class ClientEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    name!: string;

    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    slug!: string;
}
