import { ProjectInfoDto } from '@projects/dtos/project-info.dto';
import { ProjectMemberDto } from '@projects/dtos/project-member.dto';
import { ProjectPricingDto } from '@projects/dtos/project-pricing.dto';
import { ProjectTimelineDto } from '@projects/dtos/project-timeline.dto';
import { AuditDto } from '@shared/dtos/audit.dto';

export class ProjectDto {
    id!: string;
    info!: ProjectInfoDto;
    timeline!: ProjectTimelineDto;
    pricing!: ProjectPricingDto | null;
    members!: ProjectMemberDto[];
    audit!: AuditDto;
}
