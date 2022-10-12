import { CommandBus, CommandHandler, EventBus } from '@nestjs/cqrs';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { CreateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/create-work-log-recurrence.command';
import { CreateWorkLogCommand } from '@work-logs/commands/impl/create-work-log.command';
import { CreateWorkLogRecurrenceDto } from '@work-logs/dtos/create-work-log-recurrence.dto';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';
import { FailedToCreateWorkLogEvent } from '@work-logs/events/impl/failed-to-create-work-log.event';
import { WorkLogCreatedEvent } from '@work-logs/events/impl/work-log-created.event';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';

@CommandHandler( CreateWorkLogCommand )
export class CreateWorkLogHandler extends BaseSyncCommandHandler<CreateWorkLogCommand, WorkLog> {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly workLogRepository: WorkLogRepository,
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus
    ) {
        super();
    }

    // FIXME: 'Key (work_log_recurrence_id)=(ca2a9336-86ff-4cd5-b36f-0e6a8fab68e9) is not present in table "work_logs".',
    async execute(command: CreateWorkLogCommand): Promise<Result<WorkLog>> {
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

        const workLog = WorkLog.create( command, project.value!, recurrence.value! );

        if( workLog.isFailed ) {
            return this.failed( command, ...workLog.errors );
        }

        const savedWorkLog = await this.saveWorkLogToDb( workLog.value! );

        return this.successful( command, savedWorkLog );
    }

    protected successful(command: CreateWorkLogCommand, workLog: WorkLog): Result<WorkLog> {
        const { context } = command.data;
        const event = new WorkLogCreatedEvent( { context, payload: workLog } );

        this.eventBus.publish( event );

        return Success( workLog );
    }

    protected failed(command: CreateWorkLogCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateWorkLogEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async createWorkLogRecurrence(command: CreateWorkLogCommand): Promise<Result<WorkLogRecurrence>> {
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

    private async getProjectById(command: CreateWorkLogCommand): Promise<Result<Project>> {
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

    private async saveWorkLogToDb(workLog: WorkLog): Promise<WorkLog> {
        const savedWorkLog = await this.workLogRepository.save( workLog );

        if( savedWorkLog.isFailed ) {
            throw new Exception( savedWorkLog.errors );
        }

        return savedWorkLog.value!;
    }
}
