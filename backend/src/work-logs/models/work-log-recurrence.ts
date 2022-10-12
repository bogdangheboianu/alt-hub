import { Project } from '@projects/models/project';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { User } from '@users/models/user';
import { ActivateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/activate-work-log-recurrence.command';
import { CreateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/create-work-log-recurrence.command';
import { DeactivateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/deactivate-work-log-recurrence.command';
import { UpdateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/update-work-log-recurrence.command';
import { WorkLogRecurrenceEntity } from '@work-logs/entities/work-log-recurrence.entity';
import { IWorkLogRecurrence } from '@work-logs/interfaces/work-log-recurrence.interface';
import { WeekDay } from '@work-logs/models/week-day';
import { WorkLogRecurrenceId } from '@work-logs/models/work-log-recurrence-id';

export class WorkLogRecurrence implements IDomainModel<WorkLogRecurrence, WorkLogRecurrenceEntity> {
    id: WorkLogRecurrenceId;
    minutesLogged: PositiveNumber;
    user: User;
    project: Project;
    weekDays: WeekDay[];
    active: boolean;
    audit: Audit;

    private constructor(data: IWorkLogRecurrence) {
        this.id = data.id ?? WorkLogRecurrenceId.generate();
        this.minutesLogged = data.minutesLogged;
        this.user = data.user;
        this.project = data.project;
        this.weekDays = data.weekDays;
        this.active = data.active;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateWorkLogRecurrenceCommand, project: Project): Result<WorkLogRecurrence> {
        const { context: { user }, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IWorkLogRecurrence, 'minutesLogged' | 'user' | 'project' | 'weekDays' | 'active'>>(
            { minutesLogged: PositiveNumber.create( payload.minutesLogged, 'minutesLogged' ) },
            { user },
            { project },
            { weekDays: Result.aggregateResults( ...payload.weekDays.map( wd => WeekDay.create( wd ) ) ) },
            { active: true }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLogRecurrence( data.value! ) );
    }

    static fromEntity(entity: WorkLogRecurrenceEntity): Result<WorkLogRecurrence> {
        const data = Result.aggregateObjects<IWorkLogRecurrence>(
            { id: WorkLogRecurrenceId.create( entity.id ) },
            { minutesLogged: PositiveNumber.create( entity.minutesLogged, 'minutesLogged' ) },
            { user: User.fromEntity( entity.user ) },
            { project: Project.fromEntity( entity.project ) },
            { weekDays: Result.aggregateResults( ...entity.weekDays.map( wd => WeekDay.create( wd ) ) ) },
            { active: entity.active },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLogRecurrence( data.value! ) );
    }

    update(command: UpdateWorkLogRecurrenceCommand): Result<WorkLogRecurrence> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IWorkLogRecurrence, 'minutesLogged' | 'weekDays' | 'audit'>>(
            { minutesLogged: this.minutesLogged.update( payload.minutesLogged, 'minutesLogged' ) },
            { weekDays: Result.aggregateResults( ...payload.weekDays.map( wd => WeekDay.create( wd ) ) ) },
            { audit: this.audit.update( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new WorkLogRecurrence( { ...this, ...data.value! } ) );
    }

    activate(command: ActivateWorkLogRecurrenceCommand): Result<WorkLogRecurrence> {
        return Success( new WorkLogRecurrence( {
                                                   ...this,
                                                   active: true,
                                                   audit : this.audit.update( command.data.context.user.id )
                                               } ) );
    }

    deactivate(command: DeactivateWorkLogRecurrenceCommand): Result<WorkLogRecurrence> {
        return Success( new WorkLogRecurrence( {
                                                   ...this,
                                                   active: false,
                                                   audit : this.audit.update( command.data.context.user.id )
                                               } ) );
    }

    includesToday(): boolean {
        return this.weekDays.map( wd => wd.getValue() )
                   .includes( new Date().getDay() );
    }

    equals(to: WorkLogRecurrence): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): WorkLogRecurrenceEntity {
        return entityFactory( WorkLogRecurrenceEntity, {
            id           : this.id.getValue(),
            minutesLogged: this.minutesLogged.getValue(),
            user         : this.user.toEntity(),
            project      : this.project.toEntity(),
            weekDays     : this.weekDays.map( wd => wd.getValue() ),
            active       : this.active,
            audit        : this.audit.toEntity()
        } );
    }
}
