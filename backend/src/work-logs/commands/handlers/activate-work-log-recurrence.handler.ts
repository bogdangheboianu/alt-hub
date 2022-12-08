import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { ActivateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/activate-work-log-recurrence.command';
import { FailedToActivateWorkLogRecurrenceEvent } from '@work-logs/events/impl/failed-to-activate-work-log-recurrence.event';
import { WorkLogRecurrenceActivatedEvent } from '@work-logs/events/impl/work-log-recurrence-activated.event';
import { WorkLogRecurrenceNotFoundException } from '@work-logs/exceptions/work-log.exceptions';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRecurrenceId } from '@work-logs/models/work-log-recurrence-id';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';

@CommandHandler( ActivateWorkLogRecurrenceCommand )
export class ActivateWorkLogRecurrenceHandler extends BaseSyncCommandHandler<ActivateWorkLogRecurrenceCommand, WorkLogRecurrence> {
    constructor(
        private readonly workLogRecurrenceRepository: WorkLogRecurrenceRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: ActivateWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
        const workLogRecurrenceResult = await this.getWorkLogRecurrenceByIdAndUserId( command );

        if( workLogRecurrenceResult.isFailed ) {
            return this.failed( command, ...workLogRecurrenceResult.errors );
        }

        const workLogRecurrence = workLogRecurrenceResult.value!;

        if( workLogRecurrence.active ) {
            return this.successful( command, workLogRecurrence );
        }

        const activatedWorkLogRecurrence = workLogRecurrence.activate( command );

        if( activatedWorkLogRecurrence.isFailed ) {
            return this.failed( command, ...activatedWorkLogRecurrence.errors );
        }

        const savedWorkLogRecurrence = await this.saveWorkLogRecurrenceToDb( activatedWorkLogRecurrence.value! );

        return this.successful( command, savedWorkLogRecurrence );
    }

    protected successful(command: ActivateWorkLogRecurrenceCommand, workLogRecurrence: WorkLogRecurrence): Result<WorkLogRecurrence> {
        const { context } = command.data;
        const event = new WorkLogRecurrenceActivatedEvent( { context, payload: workLogRecurrence } );

        this.eventBus.publish( event );

        return Success( workLogRecurrence );
    }

    protected failed(command: ActivateWorkLogRecurrenceCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToActivateWorkLogRecurrenceEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getWorkLogRecurrenceByIdAndUserId(command: ActivateWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
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

    private async saveWorkLogRecurrenceToDb(workLogRecurrence: WorkLogRecurrence): Promise<WorkLogRecurrence> {
        const savedRecurrence = await this.workLogRecurrenceRepository.save( workLogRecurrence );

        if( savedRecurrence.isFailed ) {
            throw new Exception( savedRecurrence.errors );
        }

        return savedRecurrence.value!;
    }
}
