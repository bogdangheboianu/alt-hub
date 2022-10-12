import { ClientModule } from '@clients/client.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignCoordinatorToProjectHandler } from '@projects/commands/handlers/project-members/assign-coordinator-to-project.handler';
import { AssignUsersToProjectHandler } from '@projects/commands/handlers/project-members/assign-users-to-project.handler';
import { CreateProjectHandler } from '@projects/commands/handlers/project/create-project.handler';
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
    AssignUsersToProjectHandler,
    AssignCoordinatorToProjectHandler
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
                 UserModule
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
