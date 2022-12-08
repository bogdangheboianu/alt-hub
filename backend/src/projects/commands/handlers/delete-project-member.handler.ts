import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteProjectMemberCommand } from '@projects/commands/impl/delete-project-member.command';
import { GroupedProjectStatuses } from '@projects/constants/project.constants';
import { FailedToDeleteProjectMemberEvent } from '@projects/events/impl/failed-to-delete-project-member.event';
import { ProjectMemberDeletedEvent } from '@projects/events/impl/project-member-deleted.event';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( DeleteProjectMemberCommand )
export class DeleteProjectMemberHandler extends BaseSyncCommandHandler<DeleteProjectMemberCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository
    ) {
        super();
    }

    async execute(command: DeleteProjectMemberCommand): Promise<Result<Project>> {
        const project = await this.getProjectById( command );

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        const updatedProject = project.value!.removeMember( command );

        if( updatedProject.isFailed ) {
            return this.failed( command, ...updatedProject.errors );
        }

        const savedProject = await this.saveProjectToDb( updatedProject.value! );

        return this.successful( command, savedProject );
    }

    protected successful(command: DeleteProjectMemberCommand, project: Project): Result<Project> {
        const { context } = command.data;
        const event = new ProjectMemberDeletedEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    protected failed(command: DeleteProjectMemberCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToDeleteProjectMemberEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getProjectById(command: DeleteProjectMemberCommand): Promise<Result<Project>> {
        const { projectId: id } = command.data.payload;
        const projectId = ProjectId.create( id );

        if( projectId.isFailed ) {
            return Failed( ...projectId.errors );
        }

        const project = await this.projectRepository.findById( projectId.value!, { statusGroup: GroupedProjectStatuses.active } );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        if( project.isNotFound ) {
            return Failed( new ProjectNotFoundException() );
        }

        return project;
    }

    private async saveProjectToDb(project: Project): Promise<Project> {
        const savedProject = await this.projectRepository.save( project );

        if( savedProject.isFailed ) {
            throw new Exception( savedProject.errors );
        }

        return savedProject.value!;
    }
}
