import { modelToClientDto } from '@clients/mappers/client.mappers';
import { modelToCompanyPricingProfileDto } from '@company/mappers/company-pricing-profile.mappers';
import { ProjectInfoDto } from '@projects/dtos/project-info.dto';
import { ProjectMemberDto } from '@projects/dtos/project-member.dto';
import { ProjectPricingDto } from '@projects/dtos/project-pricing.dto';
import { ProjectTimelineDto } from '@projects/dtos/project-timeline.dto';
import { ProjectDto } from '@projects/dtos/project.dto';
import { Project } from '@projects/models/project';
import { ProjectInfo } from '@projects/models/project-info';
import { ProjectMember } from '@projects/models/project-member';
import { ProjectPricing } from '@projects/models/project-pricing';
import { ProjectTimeline } from '@projects/models/project-timeline';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { modelToOptionalMoneyDto } from '@shared/mappers/money.mappers';
import { modelToUserDto } from '@users/mappers/user.mappers';

export const modelToProjectDto = (model: Project, forAdmin: boolean): ProjectDto => (
    {
        id      : model.id.getValue(),
        info    : modelToProjectInfoDto( model.info ),
        timeline: modelToProjectTimelineDto( model.timeline ),
        pricing : forAdmin
                  ? modelToProjectPricingDto( model.pricing )
                  : null,
        members : modelsToProjectMemberDtoList( model.members, forAdmin ),
        audit   : modelToAuditDto( model.audit )
    }
);

export const modelsToProjectDtoList = (models: Project[], forAdmin: boolean): ProjectDto[] => models.map( m => modelToProjectDto( m, forAdmin ) );

const modelToProjectInfoDto = (model: ProjectInfo): ProjectInfoDto => (
    {
        name       : model.name.getValue(),
        slug       : model.slug.getValue(),
        description: model.description.getValue(),
        client     : valueIsNotEmpty( model.client )
                     ? modelToClientDto( model.client )
                     : null,
        clientName : model.clientName?.getValue() ?? null
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

const modelToProjectPricingDto = (model: ProjectPricing): ProjectPricingDto => (
    {
        type      : model.type.getValue(),
        hourlyRate: modelToOptionalMoneyDto( model.hourlyRate ),
        fixedPrice: modelToOptionalMoneyDto( model.fixedPrice )
    }
);

const modelToProjectMemberDto = (model: ProjectMember, forAdmin: boolean): ProjectMemberDto => (
    {
        id            : model.id.getValue(),
        user          : modelToUserDto( model.user ),
        pricingProfile: forAdmin
                        ? modelToCompanyPricingProfileDto( model.pricingProfile )
                        : null,
        isCoordinator : model.isCoordinator,
        allocatedHours: model.allocatedHours.getValue(),
        audit         : modelToAuditDto( model.audit )
    }
);

const modelsToProjectMemberDtoList = (models: ProjectMember[], forAdmin: boolean): ProjectMemberDto[] => models.map( m => modelToProjectMemberDto( m, forAdmin ) );
