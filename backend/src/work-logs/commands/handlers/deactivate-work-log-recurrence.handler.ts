import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { DeactivateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/deactivate-work-log-recurrence.command';
import { FailedToDeactivateWorkLogRecurrenceEvent } from '@work-logs/events/impl/failed-to-deactivate-work-log-recurrence.event';
import { WorkLogRecurrenceDeactivatedEvent } from '@work-logs/events/impl/work-log-recurrence-deactivated.event';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRecurrenceId } from '@work-logs/models/work-log-recurrence-id';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';

@CommandHandler( DeactivateWorkLogRecurrenceCommand )
export class DeactivateWorkLogRecurrenceHandler extends BaseSyncCommandHandler<DeactivateWorkLogRecurrenceCommand, WorkLogRecurrence> {
    constructor(
        private readonly workLogRecurrenceRepository: WorkLogRecurrenceRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: DeactivateWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
        const workLogRecurrenceResult = await this.getWorkLogRecurrenceByIdAndUserId( command );

        if( workLogRecurrenceResult.isFailed ) {
            return this.failed( command, ...workLogRecurrenceResult.errors );
        }

        const workLogRecurrence = workLogRecurrenceResult.value!;
        
        if( !workLogRecurrence.active ) {
            return this.successful( command, workLogRecurrence );
        }

        const deactivatedWorkLogRecurrence = workLogRecurrence.deactivate( command );

        if( deactivatedWorkLogRecurrence.isFailed ) {
            return this.failed( command, ...deactivatedWorkLogRecurrence.errors );
        }

        const savedWorkLogRecurrence = await this.saveWorkLogRecurrenceToDb( deactivatedWorkLogRecurrence.value! );

        return this.successful( command, savedWorkLogRecurrence );
    }

    protected successful(command: DeactivateWorkLogRecurrenceCommand, workLogRecurrence: WorkLogRecurrence): Result<WorkLogRecurrence> {
        const { context } = command.data;
        const event = new WorkLogRecurrenceDeactivatedEvent( { context, payload: workLogRecurrence } );

        this.eventBus.publish( event );

        return Success( workLogRecurrence );
    }

    protected failed(command: DeactivateWorkLogRecurrenceCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToDeactivateWorkLogRecurrenceEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getWorkLogRecurrenceByIdAndUserId(command: DeactivateWorkLogRecurrenceCommand): Promise<Result<WorkLogRecurrence>> {
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
