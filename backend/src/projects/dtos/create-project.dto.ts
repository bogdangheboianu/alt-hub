import { CreateProjectInfoDto } from '@projects/dtos/create-project-info.dto';
import { CreateProjectPricingDto } from '@projects/dtos/create-project-pricing.dto';
import { CreateProjectTimelineDto } from '@projects/dtos/create-project-timeline.dto';

export class CreateProjectDto {
    info!: CreateProjectInfoDto;
    timeline!: CreateProjectTimelineDto;
    pricing!: CreateProjectPricingDto;
}
