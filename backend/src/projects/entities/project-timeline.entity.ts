import { ProjectStatusEnum } from '@projects/enums/project-status.enum';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column } from 'typeorm';

export class ProjectTimelineEntity {
    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: true } )
    startDate!: Date | null;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: true } )
    endDate!: Date | null;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: true } )
    deadline!: Date | null;

    @Column( { type: ColTypesEnum.Enum, enum: ProjectStatusEnum } )
    status!: ProjectStatusEnum;
}
