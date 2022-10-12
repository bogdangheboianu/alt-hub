import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseAsyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { HandleRecurrentWorkLogsCommand } from '@work-logs/commands/impl/handle-recurrent-work-logs.command';
import { FailedToHandleRecurrentWorkLogsEvent } from '@work-logs/events/impl/failed-to-handle-recurrent-work-logs.event';
import { RecurrentWorkLogsHandledEvent } from '@work-logs/events/impl/recurrent-work-logs-handled.event';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';

@CommandHandler( HandleRecurrentWorkLogsCommand )
export class HandleRecurrentWorkLogsHandler extends BaseAsyncCommandHandler<HandleRecurrentWorkLogsCommand> {
    constructor(
        private readonly workLogRecurrenceRepository: WorkLogRecurrenceRepository,
        private readonly workLogRepository: WorkLogRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: HandleRecurrentWorkLogsCommand): Promise<void> {
        const workLogRecurrences = await this.getAllWorkLogRecurrences();

        if( workLogRecurrences.isFailed ) {
            return this.failed( command, ...workLogRecurrences.errors );
        }

        if( valueIsEmpty( workLogRecurrences.value ) ) {
            return;
        }

        const workLogs = this.createWorkLogs( workLogRecurrences.value! );
        const savedWorkLogs = await this.saveWorkLogsToDb( workLogs );

        return this.successful( command, savedWorkLogs );
    }

    protected successful(command: HandleRecurrentWorkLogsCommand, workLogs: WorkLog[]): void {
        const { context } = command.data;
        const event = new RecurrentWorkLogsHandledEvent( { context, payload: workLogs } );

        this.eventBus.publish( event );
    }

    protected failed(command: HandleRecurrentWorkLogsCommand, ...errors: IException[]): void {
        const { context } = command.data;
        const event = new FailedToHandleRecurrentWorkLogsEvent( { context, errors } );

        this.eventBus.publish( event );
    }

    private async getAllWorkLogRecurrences(): Promise<Result<WorkLogRecurrence[]>> {
        const recurrences = await this.workLogRecurrenceRepository.findAllActive();

        if( recurrences.isFailed ) {
            throw new Exception( recurrences.errors );
        }

        if( recurrences.isNotFound ) {
            return Success( [] );
        }

        return recurrences;
    }

    private createWorkLogs(recurrences: WorkLogRecurrence[]): WorkLog[] {
        const workLogs: WorkLog[] = [];

        recurrences.forEach( recurrence => {
            if( recurrence.includesToday() ) {
                workLogs.push( WorkLog.createFromRecurrence( recurrence ) );
            }
        } );

        return workLogs;
    }

    private saveWorkLogsToDb(workLogs: WorkLog[]): Promise<WorkLog[]> {
        return this.workLogRepository.saveAll( workLogs );
    }
}
