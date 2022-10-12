import { CreateProjectInfoDto } from '@projects/dtos/create-project-info.dto';
import { CreateProjectTimelineDto } from '@projects/dtos/create-project-timeline.dto';

export class CreateProjectDto {
    info!: CreateProjectInfoDto;
    timeline!: CreateProjectTimelineDto;
}
