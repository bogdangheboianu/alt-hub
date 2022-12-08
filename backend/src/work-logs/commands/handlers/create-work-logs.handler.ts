import { CommandBus, CommandHandler, EventBus } from '@nestjs/cqrs';
import { GroupedProjectStatuses } from '@projects/constants/project.constants';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { CreateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/create-work-log-recurrence.command';
import { CreateWorkLogsCommand } from '@work-logs/commands/impl/create-work-logs.command';
import { CreateWorkLogRecurrenceDto } from '@work-logs/dtos/create-work-log-recurrence.dto';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';
import { FailedToCreateWorkLogsEvent } from '@work-logs/events/impl/failed-to-create-work-logs.event';
import { WorkLogsCreatedEvent } from '@work-logs/events/impl/work-logs-created.event';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';

@CommandHandler( CreateWorkLogsCommand )
export class CreateWorkLogsHandler extends BaseSyncCommandHandler<CreateWorkLogsCommand, WorkLog[]> {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly workLogRepository: WorkLogRepository,
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus
    ) {
        super();
    }

    async execute(command: CreateWorkLogsCommand): Promise<Result<WorkLog[]>> {
        const recurrence: Result<WorkLogRecurrence | undefined> = valueIsEmpty( command.data.payload.weekDaysRecurrence )
                                                                  ? Success( undefined )
                                                                  : await this.createWorkLogRecurrence( command );
        if( recurrence.isFailed ) {
            return this.failed( command, ...recurrence.errors );
        }

        const project = valueIsEmpty( recurrence.value )
                        ? await this.getProjectById( command )
                        : Success( recurrence.value!.project );

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        // const existingWorkLogs = await this.getWorkLogsByDatesAndProjectIdAndUserId( command, project.value! );
        //
        // if( existingWorkLogs.isFailed ) {
        //     return this.failed( command, ...existingWorkLogs.errors );
        // }

        let workLogs = Result.aggregateResults( ...command.data.payload.dates.map( date => WorkLog.create( command, project.value!, date, recurrence.value! ) ) );

        if( workLogs.isFailed ) {
            return this.failed( command, ...workLogs.errors );
        }

        // TODO: find a way to compare timestamps with time zone by date in postgresql
        // if( valueIsNotEmpty( existingWorkLogs.value ) ) {
        //     workLogs = this.mergeWorkLogs( command, workLogs.value!, existingWorkLogs.value! );
        //
        //     if( workLogs.isFailed ) {
        //         return this.failed( command, ...workLogs.errors );
        //     }
        // }

        const savedWorkLogs = await this.saveWorkLogsToDb( workLogs.value! );

        return this.successful( command, savedWorkLogs );
    }

    protected successful(command: CreateWorkLogsCommand, workLogs: WorkLog[]): Result<WorkLog[]> {
        const { context } = command.data;
        const event = new WorkLogsCreatedEvent( { context, payload: workLogs } );

        this.eventBus.publish( event );

        return Success( workLogs );
    }

    protected failed(command: CreateWorkLogsCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateWorkLogsEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async createWorkLogRecurrence(command: CreateWorkLogsCommand): Promise<Result<WorkLogRecurrence>> {
        const { minutesLogged, projectId, weekDaysRecurrence } = command.data.payload;
        const validation = ValidationChain.validate<any>()
                                          .isEnumList( weekDaysRecurrence, WeekDayEnum, 'weekDaysRecurrence' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        const payload: CreateWorkLogRecurrenceDto = {
            minutesLogged,
            projectId,
            weekDays: weekDaysRecurrence!
        };
        const createRecurrenceCommand = new CreateWorkLogRecurrenceCommand( {
                                                                                context: command.data.context,
                                                                                payload
                                                                            } );

        return this.commandBus.execute( createRecurrenceCommand );
    }

    private async getProjectById(command: CreateWorkLogsCommand): Promise<Result<Project>> {
        const projectId = ProjectId.create( command.data.payload.projectId, 'projectId' );

        if( projectId.isFailed ) {
            return Failed( ...projectId.errors );
        }

        const project = await this.projectRepository.findById(
            projectId.value!,
            { statusGroup: GroupedProjectStatuses.active, userId: command.data.context.user.id } );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        if( project.isNotFound ) {
            return Failed( new ProjectNotFoundException() );
        }

        return project;
    }

    private async getWorkLogsByDatesAndProjectIdAndUserId(command: CreateWorkLogsCommand, project: Project): Promise<Result<WorkLog[]>> {
        const { context: { user }, payload: { dates } } = command.data;
        const workLogDates = Result.aggregateResults( ...dates.map( date => MandatoryDate.create( date, 'date' ) ) );

        if( workLogDates.isFailed ) {
            return Failed( ...workLogDates.errors );
        }

        const workLogs: Result<WorkLog[]> = await this.workLogRepository.findByDatesAndProjectIdAndUserId( workLogDates.value!, user.id, project.id );

        if( workLogs.isFailed ) {
            throw new Exception( workLogs.errors );
        }

        if( workLogs.isNotFound ) {
            return Success( [] );
        }

        return workLogs;
    }

    private mergeWorkLogs(command: CreateWorkLogsCommand, workLogs: WorkLog[], withWorkLogs: WorkLog[]): Result<WorkLog[]> {
        return Result.aggregateResults(
            ...workLogs.map( workLog => {
                                 const compatibleWorkLog = withWorkLogs.find( wl => wl.equals( workLog ) );
                                 return valueIsNotEmpty( compatibleWorkLog )
                                        ? workLog.merge( command, compatibleWorkLog )
                                        : Success( workLog );
                             }
            )
        );
    }

    private async saveWorkLogsToDb(workLogs: WorkLog[]): Promise<WorkLog[]> {
        const savedWorkLogs = await this.workLogRepository.saveAll( workLogs );

        if( savedWorkLogs.isFailed ) {
            throw new Exception( savedWorkLogs.errors );
        }

        return savedWorkLogs.value!;
    }
}
