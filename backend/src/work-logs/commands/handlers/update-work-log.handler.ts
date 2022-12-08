import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { GroupedProjectStatuses } from '@projects/constants/project.constants';
import { ProjectNotFoundException } from '@projects/exceptions/project.exceptions';
import { Project } from '@projects/models/project';
import { ProjectId } from '@projects/models/project-id';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { UpdateWorkLogCommand } from '@work-logs/commands/impl/update-work-log.command';
import { FailedToUpdateWorkLogEvent } from '@work-logs/events/impl/failed-to-update-work-log.event';
import { WorkLogUpdatedEvent } from '@work-logs/events/impl/work-log-updated.event';
import { WorkLogNotFoundException } from '@work-logs/exceptions/work-log.exceptions';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogId } from '@work-logs/models/work-log-id';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';

@CommandHandler( UpdateWorkLogCommand )
export class UpdateWorkLogHandler extends BaseSyncCommandHandler<UpdateWorkLogCommand, WorkLog> {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly workLogRepository: WorkLogRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: UpdateWorkLogCommand): Promise<Result<WorkLog>> {
        const workLog = await this.getWorkLogById( command );

        if( workLog.isFailed ) {
            return this.failed( command, ...workLog.errors );
        }

        const project = await this.getProjectById( command, workLog.value! );

        if( project.isFailed ) {
            return this.failed( command, ...project.errors );
        }

        const updatedWorkLog = workLog.value!.update( command, project.value! );

        if( updatedWorkLog.isFailed ) {
            return this.failed( command, ...updatedWorkLog.errors );
        }

        const savedWorkLog = await this.saveWorkLogToDb( updatedWorkLog.value! );

        return this.successful( command, savedWorkLog );
    }

    protected successful(command: UpdateWorkLogCommand, workLog: WorkLog): Result<WorkLog> {
        const { context } = command.data;
        const event = new WorkLogUpdatedEvent( { context, payload: workLog } );

        this.eventBus.publish( event );

        return Success( workLog );
    }

    protected failed(command: UpdateWorkLogCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToUpdateWorkLogEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getWorkLogById(command: UpdateWorkLogCommand): Promise<Result<WorkLog>> {
        const { context: { user }, payload: { id } } = command.data;
        const workLogId = WorkLogId.create( id, 'id' );

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

    private async getProjectById(command: UpdateWorkLogCommand, workLog: WorkLog): Promise<Result<Project>> {
        const projectId = ProjectId.create( command.data.payload.projectId, 'projectId' );

        if( projectId.isFailed ) {
            return Failed( ...projectId.errors );
        }

        if( valueIsNotEmpty( workLog.project ) && workLog.project.id.equals( projectId.value! ) ) {
            return Success( workLog.project );
        }

        const project = await this.projectRepository.findById( projectId.value!, { statusGroup: GroupedProjectStatuses.active } );

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
