import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { DeleteWorkLogRecurrenceCommand } from '@work-logs/commands/impl/delete-work-log-recurrence.command';
import { FailedToDeleteWorkLogRecurrenceEvent } from '@work-logs/events/impl/failed-to-delete-work-log-recurrence.event';
import { WorkLogRecurrenceDeletedEvent } from '@work-logs/events/impl/work-log-recurrence-deleted.event';
import { WorkLogRecurrenceNotFoundException } from '@work-logs/exceptions/work-log.exceptions';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRecurrenceId } from '@work-logs/models/work-log-recurrence-id';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';

@CommandHandler( DeleteWorkLogRecurrenceCommand )
export class DeleteWorkLogRecurrenceHandler extends BaseSyncCommandHandler<DeleteWorkLogRecurrenceCommand, WorkLogRecurrence> {
    constructor(
        private readonly workLogRecurrenceRepository: WorkLogRecurrenceRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: DeleteWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
        const workLogRecurrenceResult = await this.getWorkLogRecurrenceByIdAndUserId( command );

        if( workLogRecurrenceResult.isFailed ) {
            return this.failed( command, ...workLogRecurrenceResult.errors );
        }

        const workLogRecurrence = workLogRecurrenceResult.value!;
        await this.workLogRecurrenceRepository.delete( workLogRecurrence );

        return this.successful( command, workLogRecurrence );
    }

    protected successful(command: DeleteWorkLogRecurrenceCommand, workLogRecurrence: WorkLogRecurrence): Result<WorkLogRecurrence> {
        const { context } = command.data;
        const event = new WorkLogRecurrenceDeletedEvent( { context, payload: workLogRecurrence } );

        this.eventBus.publish( event );

        return Success( workLogRecurrence );
    }

    protected failed(command: DeleteWorkLogRecurrenceCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToDeleteWorkLogRecurrenceEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getWorkLogRecurrenceByIdAndUserId(command: DeleteWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
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
            return Failed( new WorkLogRecurrenceNotFoundException() );
        }

        return recurrence;
    }
}
