import { modelToClientDto } from '@clients/mappers/client.mappers';
import { ProjectInfoDto } from '@projects/dtos/project-info.dto';
import { ProjectMembersDataDto } from '@projects/dtos/project-members-data.dto';
import { ProjectTimelineDto } from '@projects/dtos/project-timeline.dto';
import { ProjectDto } from '@projects/dtos/project.dto';
import { Project } from '@projects/models/project';
import { ProjectInfo } from '@projects/models/project-info';
import { ProjectMembersData } from '@projects/models/project-members-data';
import { ProjectTimeline } from '@projects/models/project-timeline';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { modelsToUserDtoList } from '@users/mappers/user.mappers';

export const modelToProjectDto = (model: Project): ProjectDto => (
    {
        id         : model.id.getValue(),
        info       : modelToProjectInfoDto( model.info ),
        timeline   : modelToProjectTimelineDto( model.timeline ),
        membersData: modelToProjectMembersData( model.membersData ),
        audit      : modelToAuditDto( model.audit )
    }
);

export const modelsToProjectDtoList = (models: Project[]): ProjectDto[] => models.map( modelToProjectDto );

const modelToProjectInfoDto = (model: ProjectInfo): ProjectInfoDto => (
    {
        name       : model.name.getValue(),
        slug       : model.slug.getValue(),
        description: model.description.getValue(),
        client     : valueIsNotEmpty( model.client )
                     ? modelToClientDto( model.client )
                     : null
    }
);

const modelToProjectMembersData = (model: ProjectMembersData): ProjectMembersDataDto => (
    {
        members          : valueIsNotEmpty( model.members )
                           ? modelsToUserDtoList( model.members )
                           : null,
        coordinatorUserId: model.coordinatorUserId.getValue()
    }
);

const modelToProjectTimelineDto = (model: ProjectTimeline): ProjectTimelineDto => (
    {
        startDate: model.period.from.getValue(),
        endDate  : model.period.to.getValue(),
        deadline : model.deadline.getValue(),
        status   : model.status.getValue()
    }
);
