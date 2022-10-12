import { ClientEntity } from '@clients/entities/client.entity';
import { ProjectStatusEnum } from '@projects/enums/project-status.enum';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserEntity } from '@users/entities/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity( 'projects' )
export class ProjectEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    name!: string;

    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    slug!: string;

    @Column( { type: ColTypesEnum.Date, nullable: true } )
    startDate!: Date | null;

    @Column( { type: ColTypesEnum.Date, nullable: true } )
    endDate!: Date | null;

    @Column( { type: ColTypesEnum.Date, nullable: true } )
    deadline!: Date | null;

    @Column( { type: ColTypesEnum.Enum, enum: ProjectStatusEnum } )
    status!: ProjectStatusEnum;

    @Column( { type: ColTypesEnum.Varchar, nullable: true } )
    description!: string | null;

    @ManyToOne( () => ClientEntity, { eager: true, nullable: true, cascade: true } )
    @JoinColumn( { name: 'client_id', referencedColumnName: 'id' } )
    client!: ClientEntity | null;

    @ManyToMany( () => UserEntity, { eager: true, cascade: true, nullable: false } )
    @JoinTable( {
                    name             : 'projects_x_users',
                    joinColumn       : { name: 'project_id', referencedColumnName: 'id' },
                    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
                } )
    members!: UserEntity[];

    @Column( { type: ColTypesEnum.UUID, nullable: true } )
    coordinatorUserId!: string | null;
}
