import { ClientModule } from '@clients/client.module';
import { CompanyModule } from '@company/company.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProjectMemberHandler } from '@projects/commands/handlers/create-project-member.handler';
import { CreateProjectHandler } from '@projects/commands/handlers/create-project.handler';
import { DeleteProjectMemberHandler } from '@projects/commands/handlers/delete-project-member.handler';
import { DeleteProjectHandler } from '@projects/commands/handlers/delete-project.handler';
import { UpdateProjectInfoHandler } from '@projects/commands/handlers/update-project-info.handler';
import { UpdateProjectMemberHandler } from '@projects/commands/handlers/update-project-member.handler';
import { UpdateProjectPricingHandler } from '@projects/commands/handlers/update-project-pricing.handler';
import { UpdateProjectTimelineHandler } from '@projects/commands/handlers/update-project-timeline.handler';
import { ProjectController } from '@projects/controllers/project.controller';
import { ProjectEntity } from '@projects/entities/project.entity';
import { GetAllProjectsHandler } from '@projects/queries/handlers/get-all-projects.handler';
import { GetProjectByIdHandler } from '@projects/queries/handlers/get-project-by-id.handler';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { ProjectService } from '@projects/services/project.service';
import { UserModule } from '@users/user.module';

const Entities = [
    ProjectEntity
];

const Controllers = [
    ProjectController
];

const CommandHandlers = [
    CreateProjectHandler,
    CreateProjectMemberHandler,
    UpdateProjectMemberHandler,
    DeleteProjectMemberHandler,
    UpdateProjectInfoHandler,
    UpdateProjectTimelineHandler,
    UpdateProjectPricingHandler,
    DeleteProjectHandler
];

const QueryHandlers = [
    GetAllProjectsHandler,
    GetProjectByIdHandler
];

const Services = [
    ProjectService
];

const Repositories = [
    ProjectRepository
];

const Exports = [
    ProjectRepository
];

@Module( {
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule,
                 ClientModule,
                 UserModule,
                 CompanyModule
             ],
             controllers: [ ...Controllers ],
             providers  : [
                 ...Services,
                 ...Repositories,
                 ...CommandHandlers,
                 ...QueryHandlers
             ],
             exports    : [ ...Exports ]
         } )
export class ProjectModule {
}
