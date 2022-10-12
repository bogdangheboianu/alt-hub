import { ProjectEntity } from '@projects/entities/project.entity';

export type ProjectInfoEntity = Pick<ProjectEntity, 'name' | 'slug' | 'client' | 'description'>;
export type ProjectMembersDataEntity = Pick<ProjectEntity, 'members' | 'coordinatorUserId'>;
export type ProjectTimelineEntity = Pick<ProjectEntity, 'startDate' | 'endDate' | 'deadline' | 'status'>;
