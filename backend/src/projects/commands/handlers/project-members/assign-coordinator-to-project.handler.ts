import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { AssignCoordinatorToProjectCommand } from '@projects/commands/impl/project-members/assign-coordinator-to-project.command';
import { CoordinatorAssignedToProjectEvent } from '@projects/events/impl/project-members/coordinator-assigned-to-project.event';
import { FailedToAssignCoordinatorToProjectEvent } from '@projects/events/impl/project-members/failed-to-assign-coordinator-to-project';
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

@CommandHandler( AssignCoordinatorToProjectCommand )
export class AssignCoordinatorToProjectHandler extends BaseSyncCommandHandler<AssignCoordinatorToProjectCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository,
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(command: AssignCoordinatorToProjectCommand): Promise<Result<Project>> {
        const project = await this.getProjectById( command );

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        const updatedProject = await this.assignCoordinatorToProject( command, project.value! );

        if( updatedProject.isFailed ) {
            return this.failed( command, ...updatedProject.errors );
        }

        const savedProject = await this.saveProjectToDb( updatedProject.value! );

        return this.successful( command, savedProject );
    }

    protected successful(command: AssignCoordinatorToProjectCommand, project: Project): Result<Project> {
        const { context } = command.data;
        const event = new CoordinatorAssignedToProjectEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    protected failed(command: AssignCoordinatorToProjectCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToAssignCoordinatorToProjectEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getProjectById(command: AssignCoordinatorToProjectCommand): Promise<Result<Project>> {
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

    private async assignCoordinatorToProject(command: AssignCoordinatorToProjectCommand, project: Project): Promise<Result<Project>> {
        const coordinator = await this.getUserById( command );

        if( coordinator.isFailed ) {
            return Failed( ...coordinator.errors );
        }

        return project.assignCoordinator( command, coordinator.value! );
    }

    private async getUserById(command: AssignCoordinatorToProjectCommand): Promise<Result<User>> {
        const { userId: id } = command.data.payload;
        const userId = UserId.create( id );

        if( userId.isFailed ) {
            return Failed( ...userId.errors );
        }

        const user = await this.userRepository.findActiveById( userId.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        return user;
    }

    private async saveProjectToDb(project: Project): Promise<Project> {
        const savedProject = await this.projectRepository.saveProject( project );

        if( savedProject.isFailed ) {
            throw new Exception( savedProject.errors );
        }

        return savedProject.value!;
    }
}
