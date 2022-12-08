import { ProjectEntity } from '@projects/entities/project.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserEntity } from '@users/entities/user.entity';
import { WorkLogRecurrenceEntity } from '@work-logs/entities/work-log-recurrence.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity( 'work_logs' )
export class WorkLogEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Text, nullable: true } )
    description!: string | null;

    @Column( { type: ColTypesEnum.Int } )
    minutesLogged!: number;

    @Column( { type: ColTypesEnum.TimestampWithTimezone } )
    date!: Date;

    @ManyToOne( () => UserEntity, { eager: true, nullable: true, onDelete: 'SET NULL' } )
    @JoinColumn( { name: 'user_id', referencedColumnName: 'id' } )
    user!: UserEntity | null;

    @Column( { type: ColTypesEnum.Varchar, nullable: true } )
    userFullName!: string;

    @ManyToOne( () => ProjectEntity, { eager: true, nullable: true, onDelete: 'SET NULL' } )
    @JoinColumn( { name: 'project_id', referencedColumnName: 'id' } )
    project!: ProjectEntity | null;

    @Column( { type: ColTypesEnum.Varchar, nullable: true } )
    projectName!: string;

    @ManyToOne( () => WorkLogRecurrenceEntity, { eager: true, nullable: true } )
    @JoinColumn( { name: 'work_log_recurrence_id', referencedColumnName: 'id' } )
    recurrence!: WorkLogRecurrenceEntity | null;
}
