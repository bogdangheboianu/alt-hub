import { ProjectInfoEntity } from '@projects/entities/project-info.entity';
import { ProjectMemberEntity } from '@projects/entities/project-member.entity';
import { ProjectPricingEntity } from '@projects/entities/project-pricing.entity';
import { ProjectTimelineEntity } from '@projects/entities/project-timeline.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity( 'projects' )
export class ProjectEntity extends BaseEntity {
    @Column( () => ProjectInfoEntity )
    info!: ProjectInfoEntity;

    @Column( () => ProjectTimelineEntity )
    timeline!: ProjectTimelineEntity;

    @Column( () => ProjectPricingEntity )
    pricing!: ProjectPricingEntity;

    @OneToMany( () => ProjectMemberEntity, member => member.project, { eager: true, cascade: true } )
    members!: ProjectMemberEntity[];
}
