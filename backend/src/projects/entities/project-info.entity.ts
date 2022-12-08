import { ClientEntity } from '@clients/entities/client.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class ProjectInfoEntity {
    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    name!: string;

    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    slug!: string;

    @Column( { type: ColTypesEnum.Varchar, nullable: true } )
    description!: string | null;

    @ManyToOne( () => ClientEntity, { eager: true, nullable: true, cascade: true, onDelete: 'SET NULL' } )
    @JoinColumn( { name: 'client_id', referencedColumnName: 'id' } )
    client!: ClientEntity | null;

    @Column( { type: ColTypesEnum.Varchar, nullable: true } )
    clientName!: string | null;
}
