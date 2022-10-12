import { ProjectInfoDto } from '@projects/dtos/project-info.dto';
import { ProjectMembersDataDto } from '@projects/dtos/project-members-data.dto';
import { ProjectTimelineDto } from '@projects/dtos/project-timeline.dto';
import { AuditDto } from '@shared/dtos/audit.dto';

export class ProjectDto {
    id!: string;
    info!: ProjectInfoDto;
    timeline!: ProjectTimelineDto;
    membersData!: ProjectMembersDataDto;
    audit!: AuditDto;
}
