import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { CreateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/create-work-log-recurrence.command';
import { FailedToCreateWorkLogRecurrenceEvent } from '@work-logs/events/impl/failed-to-create-work-log-recurrence.event';
import { WorkLogRecurrenceCreatedEvent } from '@work-logs/events/impl/work-log-recurrence-created.event';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';

@CommandHandler( CreateWorkLogRecurrenceCommand )
export class CreateWorkLogRecurrenceHandler extends BaseSyncCommandHandler<CreateWorkLogRecurrenceCommand, WorkLogRecurrence> {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly workLogRecurrenceRepository: WorkLogRecurrenceRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: CreateWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
        const project = await this.getProjectById( command );

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        const workLogRecurrence = WorkLogRecurrence.create( command, project.value! );

        if( workLogRecurrence.isFailed ) {
            return this.failed( command, ...workLogRecurrence.errors );
        }

        const savedWorkLogRecurrence = await this.saveWorkLogRecurrenceToDb( workLogRecurrence.value! );

        return this.successful( command, savedWorkLogRecurrence );
    }

    protected successful(command: CreateWorkLogRecurrenceCommand, workLogRecurrence: WorkLogRecurrence): Result<WorkLogRecurrence> {
        const { context } = command.data;
        const event = new WorkLogRecurrenceCreatedEvent( { context, payload: workLogRecurrence } );

        this.eventBus.publish( event );

        return Success( workLogRecurrence );
    }

    protected failed(command: CreateWorkLogRecurrenceCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateWorkLogRecurrenceEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getProjectById(command: CreateWorkLogRecurrenceCommand): Promise<Result<Project>> {
        const projectId = ProjectId.create( command.data.payload.projectId, 'projectId' );

        if( projectId.isFailed ) {
            return Failed( ...projectId.errors );
        }

        const project = await this.projectRepository.findOngoingProjectById( projectId.value! );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        if( project.isNotFound ) {
            return Failed( new ProjectNotFoundException() );
        }

        return project;
    }

    private async saveWorkLogRecurrenceToDb(workLogRecurrence: WorkLogRecurrence): Promise<WorkLogRecurrence> {
        return await this.workLogRecurrenceRepository.save( workLogRecurrence );
    }
}
