import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { AssignUsersToProjectCommand } from '@projects/commands/impl/project-members/assign-users-to-project.command';
import { FailedToAssignUsersToProjectEvent } from '@projects/events/impl/project-members/failed-to-assign-users-to-project.event';
import { UsersAssignedToProjectEvent } from '@projects/events/impl/project-members/users-assigned-to-project.event';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( AssignUsersToProjectCommand )
export class AssignUsersToProjectHandler extends BaseSyncCommandHandler<AssignUsersToProjectCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository,
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(command: AssignUsersToProjectCommand): Promise<Result<Project>> {
        const project = await this.getProjectById( command );

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        const updatedProject = await this.assignUsersToProject( command, project.value! );

        if( updatedProject.isFailed ) {
            return this.failed( command, ...updatedProject.errors );
        }

        const savedProject = await this.saveProjectToDb( updatedProject.value! );

        return this.successful( command, savedProject );
    }

    protected successful(command: AssignUsersToProjectCommand, project: Project): Result<Project> {
        const { context } = command.data;
        const event = new UsersAssignedToProjectEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    protected failed(command: AssignUsersToProjectCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToAssignUsersToProjectEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getProjectById(command: AssignUsersToProjectCommand): Promise<Result<Project>> {
        const { projectId: id } = command.data.payload;
        const projectId = ProjectId.create( id );

        if( projectId.isFailed ) {
            return Failed( ...projectId.errors );
        }

        const project = await this.projectRepository.findActiveProjectById( projectId.value! );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        if( project.isNotFound ) {
            return Failed( new ProjectNotFoundException() );
        }

        return project;
    }

    private async assignUsersToProject(command: AssignUsersToProjectCommand, project: Project): Promise<Result<Project>> {
        const users = await this.getUsersByIds( command );

        if( users.isFailed ) {
            return Failed( ...users.errors );
        }

        return project.assignUsers( command, users.value! );
    }

    private async getUsersByIds(command: AssignUsersToProjectCommand): Promise<Result<User[]>> {
        const { usersIds: ids } = command.data.payload;
        const usersIds = Result.aggregateResults( ...ids.map( id => UserId.create( id ) ) );

        if( usersIds.isFailed ) {
            return Failed( ...usersIds.errors );
        }

        const users = await this.userRepository.findAllActiveByIdList( usersIds.value! );

        if( users.isFailed ) {
            throw new Exception( users.errors );
        }

        if( users.isNotFound || users.value!.length !== ids.length ) {
            return Failed( new UserNotFoundException() );
        }

        return users;
    }

    private async saveProjectToDb(project: Project): Promise<Project> {
        const savedProject = await this.projectRepository.saveProject( project );

        if( savedProject.isFailed ) {
            throw new Exception( savedProject.errors );
        }

        return savedProject.value!;
    }
}
