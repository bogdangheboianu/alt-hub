import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteProjectCommand } from '@projects/commands/impl/delete-project.command';
import { FailedToDeleteProjectEvent } from '@projects/events/impl/failed-to-delete-project.event';
import { ProjectDeletedEvent } from '@projects/events/impl/project-deleted.event';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( DeleteProjectCommand )
export class DeleteProjectHandler extends BaseSyncCommandHandler<DeleteProjectCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository
    ) {
        super();
    }

    async execute(command: DeleteProjectCommand): Promise<Result<Project>> {
        const project = await this.getProjectById( command );

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        await this.projectRepository.delete( project.value! );

        return this.successful( command, project.value! );
    }

    protected failed(command: DeleteProjectCommand, ...errors: IException[]): Result<Project> {
        const { context } = command.data;
        const event = new FailedToDeleteProjectEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: DeleteProjectCommand, project: Project): Result<any> {
        const { context } = command.data;
        const event = new ProjectDeletedEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    private async getProjectById(command: DeleteProjectCommand): Promise<Result<Project>> {
        const { payload: { projectId } } = command.data;

        const id = ProjectId.create( projectId, 'projectId' );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        const project = await this.projectRepository.findById( id.value! );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }
        if( project.isNotFound ) {
            return Failed( new ProjectNotFoundException() );
        }

        return project;
    }
}
