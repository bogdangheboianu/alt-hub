import { ProjectId } from '@projects/models/project-id';
import { ProjectInfo } from '@projects/models/project-info';
import { ProjectMember } from '@projects/models/project-member';
import { ProjectPricing } from '@projects/models/project-pricing';
import { ProjectTimeline } from '@projects/models/project-timeline';
import { Audit } from '@shared/models/audit/audit';

export interface IProject {
    id?: ProjectId;
    info: ProjectInfo;
    timeline?: ProjectTimeline;
    pricing?: ProjectPricing;
    members?: ProjectMember[];
    audit?: Audit;
}
