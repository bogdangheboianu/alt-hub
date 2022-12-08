import { CompanyPricingProfileEntity } from '@company/entities/company-pricing-profile.entity';
import { ProjectEntity } from '@projects/entities/project.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserEntity } from '@users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity( 'project_members' )
export class ProjectMemberEntity extends BaseEntity {
    @ManyToOne( () => UserEntity, { eager: true, nullable: false, cascade: true, onDelete: 'RESTRICT' } )
    @JoinColumn( { name: 'user_id', referencedColumnName: 'id' } )
    user!: UserEntity;

    @ManyToOne( () => CompanyPricingProfileEntity, { eager: true, cascade: true, nullable: false, onDelete: 'RESTRICT' } )
    @JoinColumn( { name: 'company_pricing_profile_id', referencedColumnName: 'id' } )
    pricingProfile!: CompanyPricingProfileEntity;

    @Column( { type: ColTypesEnum.Bool, nullable: false } )
    isCoordinator!: boolean;

    @Column( { type: ColTypesEnum.Int, nullable: true } )
    allocatedHours!: number | null;

    @ManyToOne( () => ProjectEntity, project => project.members, { lazy: true, nullable: false, onDelete: 'CASCADE', orphanedRowAction: 'delete' } )
    @JoinColumn( { name: 'project_id', referencedColumnName: 'id' } )
    project?: Promise<ProjectEntity>;
}
