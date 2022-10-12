import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { UpdateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/update-work-log-recurrence.command';
import { FailedToCreateWorkLogRecurrenceEvent } from '@work-logs/events/impl/failed-to-create-work-log-recurrence.event';
import { WorkLogRecurrenceCreatedEvent } from '@work-logs/events/impl/work-log-recurrence-created.event';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRecurrenceId } from '@work-logs/models/work-log-recurrence-id';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';

@CommandHandler( UpdateWorkLogRecurrenceCommand )
export class UpdateWorkLogRecurrenceHandler extends BaseSyncCommandHandler<UpdateWorkLogRecurrenceCommand, WorkLogRecurrence> {
    constructor(
        private readonly workLogRecurrenceRepository: WorkLogRecurrenceRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: UpdateWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
        const workLogRecurrence = await this.getWorkLogRecurrenceByIdAndUserId( command );

        if( workLogRecurrence.isFailed ) {
            return this.failed( command, ...workLogRecurrence.errors );
        }

        const updatedWorkLogRecurrence = workLogRecurrence.value!.update( command );

        if( updatedWorkLogRecurrence.isFailed ) {
            return this.failed( command, ...updatedWorkLogRecurrence.errors );
        }

        const savedWorkLogRecurrence = await this.saveWorkLogRecurrenceToDb( updatedWorkLogRecurrence.value! );

        return this.successful( command, savedWorkLogRecurrence );
    }

    protected successful(command: UpdateWorkLogRecurrenceCommand, workLogRecurrence: WorkLogRecurrence): Result<WorkLogRecurrence> {
        const { context } = command.data;
        const event = new WorkLogRecurrenceCreatedEvent( { context, payload: workLogRecurrence } );

        this.eventBus.publish( event );

        return Success( workLogRecurrence );
    }

    protected failed(command: UpdateWorkLogRecurrenceCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateWorkLogRecurrenceEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getWorkLogRecurrenceByIdAndUserId(command: UpdateWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
        const { context: { user }, payload: { id } } = command.data;
        const recurrenceId = WorkLogRecurrenceId.create( id, 'id' );

        if( recurrenceId.isFailed ) {
            return Failed( ...recurrenceId.errors );
        }

        const recurrence = await this.workLogRecurrenceRepository.findByIdAndUserId( recurrenceId.value!, user.id );

        if( recurrence.isFailed ) {
            throw new Exception( recurrence.errors );
        }

        if( recurrence.isNotFound ) {
            return Failed( new ProjectNotFoundException() );
        }

        return recurrence;
    }

    private async saveWorkLogRecurrenceToDb(workLogRecurrence: WorkLogRecurrence): Promise<WorkLogRecurrence> {
        return await this.workLogRecurrenceRepository.save( workLogRecurrence );
    }
}
