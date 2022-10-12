import { ClientNotFoundException } from '@clients/exceptions/client.exceptions';
import { Client } from '@clients/models/domain-models/client';
import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientRepository } from '@clients/repositories/client.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateProjectCommand } from '@projects/commands/impl/project/create-project.command';
import { FailedToCreateProjectEvent } from '@projects/events/impl/project/failed-to-create-project.event';
import { ProjectCreatedEvent } from '@projects/events/impl/project/project-created.event';
import { DuplicateProjectNameException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectName } from '@projects/models/project-name';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( CreateProjectCommand )
export class CreateProjectHandler extends BaseSyncCommandHandler<CreateProjectCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository,
        private readonly clientRepository: ClientRepository
    ) {
        super();
    }

    async execute(command: CreateProjectCommand): Promise<Result<Project>> {
        const projectNameUniquenessCheck = await this.checkForProjectNameUniqueness( command );

        if( projectNameUniquenessCheck.isFailed ) {
            return this.failed( command, ...projectNameUniquenessCheck.errors );
        }

        const clientId = command.data.payload.info.clientId;
        let client;

        if( valueIsNotEmpty( clientId ) ) {
            const clientResult = await this.getClientById( clientId! );

            if( clientResult.isFailed ) {
                return this.failed( command, ...clientResult.errors );
            }

            client = clientResult.value!;
        }

        const project = this.createProject( command, client );

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        const savedProject = await this.saveProjectToDb( project.value! );

        return this.successful( command, savedProject );
    }

    protected successful(command: CreateProjectCommand, project: Project): Result<Project> {
        const { context } = command.data;
        const event = new ProjectCreatedEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    protected failed(command: CreateProjectCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateProjectEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async checkForProjectNameUniqueness(command: CreateProjectCommand): Promise<Result<Project>> {
        const name = command.data.payload.info.name;
        const projectName = ProjectName.create( name );

        if( projectName.isFailed ) {
            return Failed( ...projectName.errors );
        }

        const project = await this.projectRepository.findProjectByName( projectName.value! );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        if( project.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicateProjectNameException() );
    }

    private createProject(command: CreateProjectCommand, beneficiary?: Client): Result<Project> {
        return Project.create( command, beneficiary );
    }

    private async getClientById(id: string): Promise<Result<Client>> {
        const beneficiaryId = ClientId.create( id, 'clientId' );

        if( beneficiaryId.isFailed ) {
            return Failed( ...beneficiaryId.errors );
        }

        const client = await this.clientRepository.findClientById( beneficiaryId.value! );

        if( client.isFailed ) {
            throw new Exception( client.errors );
        }

        if( client.isNotFound ) {
            return Failed( new ClientNotFoundException() );
        }

        return client;
    }

    private async saveProjectToDb(project: Project): Promise<Project> {
        const savedProject = await this.projectRepository.saveProject( project );

        if( savedProject.isFailed ) {
            throw new Exception( savedProject.errors );
        }

        return savedProject.value!;
    }
}
