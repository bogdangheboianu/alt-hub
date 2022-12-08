import { Project } from '@projects/models/project';
import { ProjectName } from '@projects/models/project-name';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { FullName } from '@users/models/full-name';
import { User } from '@users/models/user';
import { CreateWorkLogsCommand } from '@work-logs/commands/impl/create-work-logs.command';
import { HandleRecurrentWorkLogsCommand } from '@work-logs/commands/impl/handle-recurrent-work-logs.command';
import { ImportWorkLogsFromFileCommand } from '@work-logs/commands/impl/import-work-logs-from-file.command';
import { UpdateWorkLogCommand } from '@work-logs/commands/impl/update-work-log.command';
import { WorkLogEntity } from '@work-logs/entities/work-log.entity';
import { IncompatibleWorkLogsException } from '@work-logs/exceptions/work-log.exceptions';
import { IWorkLog } from '@work-logs/interfaces/work-log.interface';
import { CsvWorkLog } from '@work-logs/models/csv-work-log';
import { OptionalWorkLogDescription } from '@work-logs/models/optional-work-log-description';
import { WorkLogId } from '@work-logs/models/work-log-id';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';

export class WorkLog implements IDomainModel<WorkLog, WorkLogEntity> {
    id: WorkLogId;
    description: OptionalWorkLogDescription;
    minutesLogged: PositiveNumber;
    date: MandatoryDate;
    user: User | null;
    userFullName: FullName;
    project: Project | null;
    projectName: ProjectName;
    recurrence: WorkLogRecurrence | null;
    audit: Audit;

    private constructor(data: IWorkLog) {
        this.id = data.id ?? WorkLogId.generate();
        this.description = data.description ?? OptionalWorkLogDescription.empty();
        this.minutesLogged = data.minutesLogged;
        this.date = data.date;
        this.user = data.user;
        this.userFullName = data.userFullName;
        this.project = data.project;
        this.projectName = data.projectName;
        this.recurrence = data.recurrence ?? null;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateWorkLogsCommand, project: Project, date: Date, recurrence?: WorkLogRecurrence): Result<WorkLog> {
        const { context: { user }, payload } = command.data;
        const data = Result.aggregateObjects<Omit<IWorkLog, 'id'>>(
            { description: OptionalWorkLogDescription.create( payload.description, 'description' ) },
            { minutesLogged: PositiveNumber.create( payload.minutesLogged, 'minutesLogged' ) },
            { date: MandatoryDate.create( date, 'dates' ) },
            { user },
            { userFullName: user.personalInfo.fullName },
            { project },
            { projectName: project.info.name },
            { recurrence },
            { audit: Audit.initial( user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLog( data.value! ) );
    }

    static fromRecurrence(command: HandleRecurrentWorkLogsCommand, recurrence: WorkLogRecurrence): WorkLog {
        return new WorkLog( {
                                minutesLogged: recurrence.minutesLogged,
                                date         : MandatoryDate.now(),
                                project      : recurrence.project,
                                projectName  : recurrence.project.info.name,
                                user         : recurrence.user,
                                userFullName : recurrence.user.personalInfo.fullName,
                                recurrence,
                                audit        : Audit.initial( recurrence.user.id )
                            } );
    }

    static fromImport(command: ImportWorkLogsFromFileCommand, user: User, project: Project, date: MandatoryDate, minutesLogged: PositiveNumber): WorkLog {
        return new WorkLog( {
                                minutesLogged,
                                date,
                                project,
                                projectName : project.info.name,
                                user,
                                userFullName: user.personalInfo.fullName,
                                audit       : Audit.initial( command.data.context.user.id )
                            } );
    }

    static fromEntity(entity: WorkLogEntity): Result<WorkLog> {
        const data = Result.aggregateObjects<IWorkLog>(
            { id: WorkLogId.create( entity.id ) },
            { description: OptionalWorkLogDescription.create( entity.description, 'description' ) },
            { minutesLogged: PositiveNumber.create( entity.minutesLogged, 'minutesLogged' ) },
            { date: MandatoryDate.create( entity.date, 'date' ) },
            {
                user: valueIsNotEmpty( entity.user )
                      ? User.fromEntity( entity.user )
                      : null
            },
            { userFullName: FullName.fromJoined( entity.userFullName, 'userFullName' ) },
            {
                project: valueIsNotEmpty( entity.project )
                         ? Project.fromEntity( entity.project )
                         : null
            },
            { projectName: ProjectName.create( entity.projectName ) },
            {
                recurrence: valueIsEmpty( entity.recurrence )
                            ? Success( undefined )
                            : WorkLogRecurrence.fromEntity( entity.recurrence )
            },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLog( data.value! ) );
    }

    update(command: UpdateWorkLogCommand, project: Project): Result<WorkLog> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Omit<IWorkLog, 'id' | 'user' | 'recurrence'>>(
            { description: this.description.update( payload.description, 'description' ) },
            { minutesLogged: this.minutesLogged.update( payload.minutesLogged, 'minutesLogged' ) },
            { date: this.date.update( payload.date, 'date' ) },
            { project },
            { projectName: project.info.name },
            { audit: this.audit.update( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLog( { ...this, ...data.value! } ) );
    }

    merge(command: CreateWorkLogsCommand | UpdateWorkLogCommand, withWorkLog: WorkLog, recurrence?: WorkLogRecurrence | null): Result<WorkLog> {
        if( !this.equals( withWorkLog ) ) {
            return Failed( new IncompatibleWorkLogsException() );
        }

        const data = Result.aggregateObjects<Pick<IWorkLog, 'minutesLogged' | 'description' | 'recurrence' | 'audit'>>(
            { minutesLogged: this.minutesLogged.plus( withWorkLog.minutesLogged ) },
            { description: this.description.append( withWorkLog.description.getValue() ) },
            { recurrence: this.recurrence ?? recurrence },
            { audit: this.audit.update( command.data.context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLog( { ...this, ...data.value! } ) );
    }

    toCsvWorkLog(): CsvWorkLog {
        return CsvWorkLog.create( this );
    }

    equals(to: WorkLog): boolean {
        let sameUser;
        let sameProject;
        const sameDate = this.date.equals( to.date, true );

        if( valueIsNotEmpty( this.user ) && valueIsNotEmpty( to.user ) ) {
            sameUser = this.user.equals( to.user );
        } else {
            sameUser = this.userFullName.equals( to.userFullName );
        }

        if( valueIsNotEmpty( this.project ) && valueIsNotEmpty( to.project ) ) {
            sameProject = this.project.equals( to.project );
        } else {
            sameProject = this.projectName.equals( to.projectName );
        }

        return this.id.equals( to.id ) || (
            sameUser && sameProject && sameDate
        );
    }

    toEntity(): WorkLogEntity {
        return entityFactory( WorkLogEntity, {
            id           : this.id.getValue(),
            description  : this.description.getValue(),
            minutesLogged: this.minutesLogged.getValue(),
            date         : this.date.getValue(),
            user         : this.user?.toEntity() ?? null,
            userFullName : this.userFullName.joined,
            project      : this.project?.toEntity() ?? null,
            projectName  : this.projectName.getValue(),
            recurrence   : this.recurrence?.toEntity() ?? null,
            audit        : this.audit.toEntity()
        } );
    }
}
