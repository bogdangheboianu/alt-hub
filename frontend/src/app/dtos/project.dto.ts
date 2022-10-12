import { AuditDto } from '@dtos/audit.dto';
import { ProjectInfoDto } from '@dtos/project-info.dto';
import { ProjectMembersDataDto } from '@dtos/project-members-data.dto';
import { ProjectTimelineDto } from '@dtos/project-timeline.dto';

export class ProjectDto {
    id!: string;
    info!: ProjectInfoDto;
    timeline!: ProjectTimelineDto;
    membersData!: ProjectMembersDataDto;
    audit!: AuditDto;
}
