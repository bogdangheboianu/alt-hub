import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ProjectStatusGroupEnum } from '@projects/enums/project-status-group.enum';

@ApiExtraModels()
export class GetAllProjectsParamsDto {
    @ApiProperty( { enum: ProjectStatusGroupEnum, enumName: 'ProjectStatusGroupEnum', nullable: true } )
    statusGroup?: ProjectStatusGroupEnum;
    clientId?: string;
}
