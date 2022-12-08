import { SendWorkLogRecurrenceConfirmationEmailCommand } from '@email/commands/impl/send-work-log-recurrence-confirmation-email.command';
import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseAsyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';
import { VacationRepository } from '@vacations/repositories/vacation.repository';
import { HandleRecurrentWorkLogsCommand } from '@work-logs/commands/impl/handle-recurrent-work-logs.command';
import { FailedToHandleRecurrentWorkLogsEvent } from '@work-logs/events/impl/failed-to-handle-recurrent-work-logs.event';
import { RecurrentWorkLogsHandledEvent } from '@work-logs/events/impl/recurrent-work-logs-handled.event';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';
import { WorkLogRecurrenceScheduler } from '@work-logs/schedulers/work-log-recurrence.scheduler';

@CommandHandler( HandleRecurrentWorkLogsCommand )
export class HandleRecurrentWorkLogsHandler extends BaseAsyncCommandHandler<HandleRecurrentWorkLogsCommand> {
    private readonly logger = new Logger( WorkLogRecurrenceScheduler.name );

    constructor(
        private readonly workLogRecurrenceRepository: WorkLogRecurrenceRepository,
        private readonly workLogRepository: WorkLogRepository,
        private readonly vacationRepository: VacationRepository,
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus
    ) {
        super();
    }

    async execute(command: HandleRecurrentWorkLogsCommand): Promise<void> {
        const workLogRecurrences = await this.getAllActiveWorkLogRecurrences();

        if( workLogRecurrences.isFailed ) {
            return this.failed( command, ...workLogRecurrences.errors );
        }

        if( valueIsEmpty( workLogRecurrences.value ) ) {
            return;
        }

        const workLogs = await this.createWorkLogs( command, workLogRecurrences.value! );
        const savedWorkLogs = await this.saveWorkLogsToDb( workLogs );

        this.logger.log( `${ workLogs.length } recurrent work logs added` );

        this.sendConfirmationEmails( command, workLogRecurrences.value! );

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

    private async getAllActiveWorkLogRecurrences(): Promise<Result<WorkLogRecurrence[]>> {
        const recurrences = await this.workLogRecurrenceRepository.findAllActive();

        if( recurrences.isFailed ) {
            throw new Exception( recurrences.errors );
        }

        if( recurrences.isNotFound ) {
            return Success( [] );
        }

        return recurrences;
    }

    private async createWorkLogs(command: HandleRecurrentWorkLogsCommand, recurrences: WorkLogRecurrence[]): Promise<WorkLog[]> {
        const workLogs: WorkLog[] = [];

        const userHasOngoingVacation = await this.getUsersOngoingVacations( recurrences );
        recurrences.forEach( (recurrence: WorkLogRecurrence) => {
            const user = recurrence.user;
            if( recurrence.includesToday() && !userHasOngoingVacation[user.id.getValue()] ) {
                workLogs.push( WorkLog.fromRecurrence( command, recurrence ) );
            }
        } );

        return workLogs;
    }

    private async getUsersOngoingVacations(recurrences: WorkLogRecurrence[]): Promise<Record<string, boolean>> {
        const usersOngoingVacations: Record<string, boolean> = {};

        for( const recurrence of recurrences ) {
            const user = recurrence.user;
            usersOngoingVacations[user.id.getValue()] = usersOngoingVacations[user.id.getValue()] ?? await this.userHasOngoingVacation( user );
        }

        return usersOngoingVacations;
    }

    private async userHasOngoingVacation(user: User): Promise<boolean> {
        const vacations = await this.vacationRepository.findAll( { userId: user.id } );

        if( vacations.isFailed ) {
            throw new Exception( vacations.errors );
        }

        if( vacations.isNotFound ) {
            return false;
        }

        return vacations.value!.some( v => v.dateInterval.isCurrent() );
    }

    private async saveWorkLogsToDb(workLogs: WorkLog[]): Promise<WorkLog[]> {
        const savedWorkLogs = await this.workLogRepository.saveAll( workLogs );

        if( savedWorkLogs.isFailed ) {
            throw new Exception( savedWorkLogs.errors );
        }

        return savedWorkLogs.value!;
    }

    private sendConfirmationEmails(command: HandleRecurrentWorkLogsCommand, recurrences: WorkLogRecurrence[]): void {
        recurrences.forEach( recurrence => {
            const emailCommand = new SendWorkLogRecurrenceConfirmationEmailCommand( {
                                                                                        context: command.data.context,
                                                                                        payload: { workLogRecurrence: recurrence }
                                                                                    } );
            this.commandBus.execute( emailCommand );
        } );
    }
}
