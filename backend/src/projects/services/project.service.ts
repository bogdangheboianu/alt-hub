import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectMemberCommand } from '@projects/commands/impl/create-project-member.command';
import { CreateProjectCommand } from '@projects/commands/impl/create-project.command';
import { DeleteProjectMemberCommand } from '@projects/commands/impl/delete-project-member.command';
import { DeleteProjectCommand } from '@projects/commands/impl/delete-project.command';
import { UpdateProjectInfoCommand } from '@projects/commands/impl/update-project-info.command';
import { UpdateProjectMemberCommand } from '@projects/commands/impl/update-project-member.command';
import { UpdateProjectPricingCommand } from '@projects/commands/impl/update-project-pricing.command';
import { UpdateProjectTimelineCommand } from '@projects/commands/impl/update-project-timeline.command';
import { CreateProjectMemberDto } from '@projects/dtos/create-project-member.dto';
import { CreateProjectDto } from '@projects/dtos/create-project.dto';
import { GetAllProjectsParamsDto } from '@projects/dtos/get-all-projects-params.dto';
import { ProjectDto } from '@projects/dtos/project.dto';
import { UpdateProjectInfoDto } from '@projects/dtos/update-project-info.dto';
import { UpdateProjectMemberDto } from '@projects/dtos/update-project-member.dto';
import { UpdateProjectPricingDto } from '@projects/dtos/update-project-pricing.dto';
import { UpdateProjectTimelineDto } from '@projects/dtos/update-project-timeline.dto';
import { modelsToProjectDtoList, modelToProjectDto } from '@projects/mappers/project.mappers';
import { Project } from '@projects/models/project';
import { GetAllProjectsQuery } from '@projects/queries/impl/get-all-projects.query';
import { GetProjectByIdQuery } from '@projects/queries/impl/get-project-by-id.query';
import { DeletedEntityResponseDto } from '@shared/dtos/deleted-entity-response.dto';
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

        return modelToProjectDto( result.value!, true );
    }

    async deleteProject(context: AuthenticatedContext, projectId: string): Promise<DeletedEntityResponseDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( projectId, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new DeleteProjectCommand( { context, payload: { projectId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return { deletedId: result.value!.id.getValue() };
    }

    async createProjectMember(context: AuthenticatedContext, data: CreateProjectMemberDto, projectId: string): Promise<ProjectDto> {
        const validation = ValidationChain.validate<typeof data & { projectId: string }>()
                                          .isUUIDv4( projectId, 'projectId' )
                                          .isUUIDv4( data.userId, 'userId' )
                                          .isUUIDv4( data.pricingProfileId, 'pricingProfileId' )
                                          .isNotEmpty( data.isCoordinator, 'isCoordinator' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateProjectMemberCommand( { context, payload: { ...data, projectId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value!, true );
    }

    async updateProjectMember(context: AuthenticatedContext, data: UpdateProjectMemberDto, projectId: string, memberId: string): Promise<ProjectDto> {
        const validation = ValidationChain.validate<typeof data & { projectId: string; memberId: string }>()
                                          .isUUIDv4( projectId, 'projectId' )
                                          .isUUIDv4( memberId, 'memberId' )
                                          .isUUIDv4( data.userId, 'userId' )
                                          .isUUIDv4( data.pricingProfileId, 'pricingProfileId' )
                                          .isNotEmpty( data.isCoordinator, 'isCoordinator' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateProjectMemberCommand( { context, payload: { ...data, projectId, memberId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value!, true );
    }

    async deleteProjectMember(context: AuthenticatedContext, projectId: string, memberId: string): Promise<ProjectDto> {
        const validation = ValidationChain.validate<{ projectId: string; memberId: string }>()
                                          .isUUIDv4( projectId, 'projectId' )
                                          .isUUIDv4( memberId, 'memberId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new DeleteProjectMemberCommand( { context, payload: { projectId, memberId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value!, true );
    }

    async getAllProjects(context: AuthenticatedContext, params: GetAllProjectsParamsDto): Promise<ProjectDto[]> {
        const query = new GetAllProjectsQuery( { context, params } );
        const result: Result<Project[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToProjectDtoList( result.value!, context.user.account.isAdmin );
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

        return modelToProjectDto( result.value!, context.user.account.isAdmin );
    }

    async updateProjectInfo(context: AuthenticatedContext, data: UpdateProjectInfoDto, projectId: string): Promise<ProjectDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( projectId, 'projectId' )
                                          .isNotEmpty( data.name, 'name' )
                                          .isUUIDv4( data.clientId, 'clientId', true )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateProjectInfoCommand( { context, payload: { ...data, projectId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value!, true );
    }

    async updateProjectTimeline(context: AuthenticatedContext, data: UpdateProjectTimelineDto, projectId: string): Promise<Promise<ProjectDto>> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( projectId, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateProjectTimelineCommand( { context, payload: { ...data, projectId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value!, true );
    }

    async updateProjectPricing(context: AuthenticatedContext, data: UpdateProjectPricingDto, projectId: string): Promise<Promise<ProjectDto>> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( projectId, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateProjectPricingCommand( { context, payload: { ...data, projectId } } );
        const result: Result<Project> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToProjectDto( result.value!, true );
    }
}
