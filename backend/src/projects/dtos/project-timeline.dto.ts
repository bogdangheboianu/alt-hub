import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatusEnum } from '@projects/enums/project-status.enum';

export class ProjectTimelineDto {
    startDate!: Date | null;
    endDate!: Date | null;
    deadline!: Date | null;
    @ApiProperty( { enum: ProjectStatusEnum, enumName: 'ProjectStatusEnum', nullable: true } )
    status!: ProjectStatusEnum;
}
