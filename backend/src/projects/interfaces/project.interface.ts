import { ProjectId } from '@projects/models/project-id';
import { ProjectInfo } from '@projects/models/project-info';
import { ProjectMembersData } from '@projects/models/project-members-data';
import { ProjectTimeline } from '@projects/models/project-timeline';
import { Audit } from '@shared/models/audit/audit';

export interface IProject {
    id?: ProjectId;
    info: ProjectInfo;
    timeline: ProjectTimeline;
    membersData?: ProjectMembersData;
    audit?: Audit;
}
