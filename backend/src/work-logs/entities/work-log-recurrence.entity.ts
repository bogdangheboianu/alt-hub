import { ProjectEntity } from '@projects/entities/project.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserEntity } from '@users/entities/user.entity';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity( 'work_log_recurrences' )
export class WorkLogRecurrenceEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Int } )
    minutesLogged!: number;

    @ManyToOne( () => UserEntity, { eager: true } )
    @JoinColumn( { name: 'user_id', referencedColumnName: 'id' } )
    user!: UserEntity;

    @ManyToOne( () => ProjectEntity, { eager: true } )
    @JoinColumn( { name: 'project_id', referencedColumnName: 'id' } )
    project!: ProjectEntity;

    @Column( { type: ColTypesEnum.Enum, enum: WeekDayEnum, array: true } )
    weekDays!: WeekDayEnum[];

    @Column( { type: ColTypesEnum.Bool, nullable: false } )
    active!: boolean;
}
