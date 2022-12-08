import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateProjectPricingCommand } from '@projects/commands/impl/update-project-pricing.command';
import { FailedToUpdateProjectPricingEvent } from '@projects/events/impl/failed-to-update-project-pricing.event';
import { ProjectPricingUpdatedEvent } from '@projects/events/impl/project-pricing-updated.event';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( UpdateProjectPricingCommand )
export class UpdateProjectPricingHandler extends BaseSyncCommandHandler<UpdateProjectPricingCommand, Project> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly projectRepository: ProjectRepository
    ) {
        super();
    }

    async execute(command: UpdateProjectPricingCommand): Promise<Result<Project>> {
        const projectToUpdate = await this.getProjectById( command );

        if( projectToUpdate.isFailed ) {
            return this.failed( command, ...projectToUpdate.errors );
        }

        const updatedProject: Result<Project> = projectToUpdate.value!.updatePricing( command );

        if( updatedProject.isFailed ) {
            return this.failed( command, ...updatedProject.errors );
        }

        const savedProject = await this.saveProjectToDb( updatedProject.value! );

        return this.successful( command, savedProject );
    }

    protected failed(command: UpdateProjectPricingCommand, ...errors: IException[]): Result<Project> {
        const { context } = command.data;
        const event = new FailedToUpdateProjectPricingEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: UpdateProjectPricingCommand, project: Project): Result<any> {
        const { context } = command.data;
        const event = new ProjectPricingUpdatedEvent( { context, payload: project } );

        this.eventBus.publish( event );

        return Success( project );
    }

    private async getProjectById(command: UpdateProjectPricingCommand): Promise<Result<Project>> {
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

    private async saveProjectToDb(updatedProject: Project): Promise<Project> {
        const savedProject = await this.projectRepository.save( updatedProject );

        if( savedProject.isFailed ) {
            throw new Exception( savedProject.errors );
        }

        return savedProject.value!;
    }
}
