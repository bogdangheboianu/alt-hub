import { CreateProjectInfoDto } from '@dtos/create-project-info.dto';
import { CreateProjectTimelineDto } from '@dtos/create-project-timeline.dto';

export class CreateProjectDto {
    info!: CreateProjectInfoDto;
    timeline!: CreateProjectTimelineDto;
}
