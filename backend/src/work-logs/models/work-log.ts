import { Project } from '@projects/models/project';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { User } from '@users/models/user';
import { CreateWorkLogCommand } from '@work-logs/commands/impl/create-work-log.command';
import { UpdateWorkLogCommand } from '@work-logs/commands/impl/update-work-log.command';
import { WorkLogEntity } from '@work-logs/entities/work-log.entity';
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
    user: User;
    project: Project;
    recurrence: WorkLogRecurrence | null;
    audit: Audit;

    private constructor(data: IWorkLog) {
        this.id = data.id ?? WorkLogId.generate();
        this.description = data.description ?? OptionalWorkLogDescription.empty();
        this.minutesLogged = data.minutesLogged;
        this.date = data.date;
        this.user = data.user;
        this.project = data.project;
        this.recurrence = data.recurrence ?? null;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateWorkLogCommand, project: Project, recurrence?: WorkLogRecurrence): Result<WorkLog> {
        const { context: { user }, payload } = command.data;
        const data = Result.aggregateObjects<Omit<IWorkLog, 'id'>>(
            { description: OptionalWorkLogDescription.create( payload.description, 'description' ) },
            { minutesLogged: PositiveNumber.create( payload.minutesLogged, 'minutesLogged' ) },
            { date: MandatoryDate.create( payload.date, 'date' ) },
            { user },
            { project },
            { recurrence },
            { audit: Audit.initial( user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLog( data.value! ) );
    }

    static createFromRecurrence(recurrence: WorkLogRecurrence): WorkLog {
        return new WorkLog( {
                                minutesLogged: recurrence.minutesLogged,
                                date         : MandatoryDate.now(),
                                project      : recurrence.project,
                                user         : recurrence.user,
                                recurrence
                            } );
    }

    static fromEntity(entity: WorkLogEntity): Result<WorkLog> {
        const data = Result.aggregateObjects<IWorkLog>(
            { id: WorkLogId.create( entity.id ) },
            { description: OptionalWorkLogDescription.create( entity.description, 'description' ) },
            { minutesLogged: PositiveNumber.create( entity.minutesLogged, 'minutesLogged' ) },
            { date: MandatoryDate.create( entity.date, 'date' ) },
            { user: User.fromEntity( entity.user ) },
            { project: Project.fromEntity( entity.project ) },
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
            { audit: this.audit.update( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLog( { ...this, ...data.value! } ) );
    }

    equals(to: WorkLog): boolean {
        return this.id.equals( to.id );
    }

    toCsvWorkLog(): CsvWorkLog {
        return CsvWorkLog.create( this );
    }

    toEntity(): WorkLogEntity {
        return entityFactory( WorkLogEntity, {
            id           : this.id.getValue(),
            description  : this.description.getValue(),
            minutesLogged: this.minutesLogged.getValue(),
            date         : this.date.getValue(),
            user         : this.user.toEntity(),
            project      : this.project.toEntity(),
            recurrence   : this.recurrence?.toEntity() ?? null,
            audit        : this.audit.toEntity()
        } );
    }
}
