import { Client } from '@clients/models/domain-models/client';
import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientRepository } from '@clients/repositories/client.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateProjectInfoCommand } from '@projects/commands/impl/update-project-info.command';
import { FailedToUpdateProjectInfoEvent } from '@projects/events/impl/failed-to-update-project-info.event';
import { ProjectInfoUpdatedEvent } from '@projects/events/impl/project-info-updated.event';
import { DuplicateProjectNameException, ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectName } from '@projects/models/project-name';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( UpdateProjectInfoCommand )
export class UpdateProjectInfoHandler extends BaseSyncCommandHandler<UpdateProjectInfoCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository,
        private readonly clientRepository: ClientRepository
    ) {
        super();
    }

    async execute(command: UpdateProjectInfoCommand): Promise<Result<Project>> {
        const projectToUpdate = await this.getProjectById( command );

        if( projectToUpdate.isFailed ) {
            return this.failed( command, ...projectToUpdate.errors );
        }

        const projectNameUniquenessCheck = await this.checkForProjectNameUniqueness( command );

        if( projectNameUniquenessCheck.isFailed ) {
            return this.failed( command, ...projectNameUniquenessCheck.errors );
        }

        const client = await this.getClientById( command, projectToUpdate.value! );

        if( client.isFailed ) {
            return this.failed( command, ...client.errors );
        }

        const updatedProject = projectToUpdate.value!.updateInfo( command, client.value );

        if( updatedProject.isFailed ) {
            return this.failed( command, ...updatedProject.errors );
        }

        const savedProject = await this.saveProjectToDb( updatedProject.value! );

        return this.successful( command, savedProject );
    }

    protected failed(command: UpdateProjectInfoCommand, ...errors: IException[]): Result<Project> {
        const { context } = command.data;
        const event = new FailedToUpdateProjectInfoEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: UpdateProjectInfoCommand, project: Project): Result<any> {
        const { context } = command.data;
        const event = new ProjectInfoUpdatedEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    private async checkForProjectNameUniqueness(command: UpdateProjectInfoCommand): Promise<Result<Project>> {
        const name = command.data.payload.name;
        const projectName = ProjectName.create( name );

        if( projectName.isFailed ) {
            return Failed( ...projectName.errors );
        }

        const projectId = ProjectId.create( command.data.payload.projectId );

        if( projectId.isFailed ) {
            return Failed( ...projectName.errors );
        }

        const project = await this.projectRepository.findByName( projectName.value! );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        if( project.isNotFound || project.value?.id.equals( projectId.value! ) ) {
            return Success();
        }

        return Failed( new DuplicateProjectNameException() );
    }

    private async getProjectById(command: UpdateProjectInfoCommand): Promise<Result<Project>> {
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

    private async saveProjectToDb(project: Project): Promise<Project> {
        const savedProject = await this.projectRepository.save( project );

        if( savedProject.isFailed ) {
            throw new Exception( savedProject.errors );
        }

        return savedProject.value!;
    }

    private async getClientById(command: UpdateProjectInfoCommand, project: Project): Promise<Result<Client | null>> {
        const { payload: { clientId } } = command.data;

        if( valueIsEmpty( clientId ) ) {
            return Success( null );
        }

        const id = ClientId.create( clientId! );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        if( project.info.client?.id.equals( id?.value! ) ) {
            return Success( project.info.client );
        }

        const client = await this.clientRepository.findById( id.value! );

        if( client.isFailed ) {
            throw new Exception( client.errors );
        }

        return Success( client.value! );
    }
}
