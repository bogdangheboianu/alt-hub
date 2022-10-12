import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AssignCoordinatorToProjectCommand } from '@projects/commands/impl/project-members/assign-coordinator-to-project.command';
import { AssignUsersToProjectCommand } from '@projects/commands/impl/project-members/assign-users-to-project.command';
import { CreateProjectCommand } from '@projects/commands/impl/project/create-project.command';
import { AssignCoordinatorToProjectDto } from '@projects/dtos/assign-coordinator-to-project.dto';
import { AssignUsersToProjectDto } from '@projects/dtos/assign-users-to-project.dto';
import { CreateProjectDto } from '@projects/dtos/create-project.dto';
import { GetAllProjectsParamsDto } from '@projects/dtos/get-all-projects-params.dto';
import { ProjectDto } from '@projects/dtos/project.dto';
import { modelsToProjectDtoList, modelToProjectDto } from '@projects/mappers/project.mappers';
import { Project } from '@projects/models/project';
import { GetAllProjectsQuery } from '@projects/queries/impl/get-all-projects.query';
import { GetProjectByIdQuery } from '@projects/queries/impl/get-project-by-id.query';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

@Injectable()
export class ProjectService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {
    }

    async createProject(context: AuthenticatedContext, data: CreateProjectDto): Promise<ProjectDto> {
        const validation = ValidationChain.validate<typeof data.info & typeof data.timeline>()
                                          .isNotEmpty( data.info.name, 'name' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateProjectCommand( { context, payload: data } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value! );
    }

    async assignUsersToProject(context: AuthenticatedContext, data: AssignUsersToProjectDto, projectId: string): Promise<ProjectDto> {
        const validation = ValidationChain.validate<typeof data & { projectId: string }>()
                                          .isNotEmpty( projectId, 'projectId' )
                                          .isUUIDv4List( data.usersIds, 'usersIds' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new AssignUsersToProjectCommand( { context, payload: { ...data, projectId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value! );
    }

    async assignCoordinatorToProject(context: AuthenticatedContext, data: AssignCoordinatorToProjectDto, projectId: string): Promise<ProjectDto> {
        const validation = ValidationChain.validate<typeof data & { projectId: string }>()
                                          .isNotEmpty( projectId, 'projectId' )
                                          .isUUIDv4( data.userId, 'userId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new AssignCoordinatorToProjectCommand( { context, payload: { ...data, projectId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value! );
    }

    async getAllProjects(context: AuthenticatedContext, params: GetAllProjectsParamsDto): Promise<ProjectDto[]> {
        const query = new GetAllProjectsQuery( { context, params } );
        const result: Result<Project[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToProjectDtoList( result.value! );
    }

    async getProjectById(context: AuthenticatedContext, id: string): Promise<ProjectDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( id, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetProjectByIdQuery( { context, params: { id } } );
        const result: Result<Project> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value! );
    }
}
