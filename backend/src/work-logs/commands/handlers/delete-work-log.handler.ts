import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { DeleteWorkLogCommand } from '@work-logs/commands/impl/delete-work-log.command';
import { FailedToDeleteWorkLogEvent } from '@work-logs/events/impl/failed-to-delete-work-log.event';
import { WorkLogDeletedEvent } from '@work-logs/events/impl/work-log-deleted.event';
import { WorkLogNotFoundException } from '@work-logs/exceptions/work-log.exceptions';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogId } from '@work-logs/models/work-log-id';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';

@CommandHandler( DeleteWorkLogCommand )
export class DeleteWorkLogHandler extends BaseSyncCommandHandler<DeleteWorkLogCommand, WorkLogId> {
    constructor(
        private readonly workLogRepository: WorkLogRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: DeleteWorkLogCommand): Promise<Result<WorkLogId>> {
        const workLog = await this.getWorkLogById( command );

        if( workLog.isFailed ) {
            return this.failed( command, ...workLog.errors );
        }

        await this.workLogRepository.delete( workLog.value! );

        return this.successful( command, workLog.value! );
    }

    protected successful(command: DeleteWorkLogCommand, workLog: WorkLog): Result<WorkLogId> {
        const { context } = command.data;
        const event = new WorkLogDeletedEvent( { context, payload: workLog } );

        this.eventBus.publish( event );

        return Success( workLog.id );
    }

    protected failed(command: DeleteWorkLogCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToDeleteWorkLogEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getWorkLogById(command: DeleteWorkLogCommand): Promise<Result<WorkLog>> {
        const { context: { user }, payload: { workLogId: id } } = command.data;
        const workLogId = WorkLogId.create( id, 'workLogId' );

        if( workLogId.isFailed ) {
            return Failed( ...workLogId.errors );
        }

        const workLog = await this.workLogRepository.findByIdAndUserId( workLogId.value!, user.id );

        if( workLog.isFailed ) {
            throw new Exception( workLog.errors );
        }

        if( workLog.isNotFound ) {
            return Failed( new WorkLogNotFoundException() );
        }

        return workLog;
    }
}
