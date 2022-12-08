import { CreateProjectTimelineDto } from '@projects/dtos/create-project-timeline.dto';
import { UpdateProjectTimelineDto } from '@projects/dtos/update-project-timeline.dto';
import { ProjectTimelineEntity } from '@projects/entities/project-timeline.entity';
import { IProjectTimeline } from '@projects/interfaces/project-timeline.interface';
import { ProjectStatus } from '@projects/models/project-status';
import { NotFutureDateException } from '@shared/exceptions/date.exceptions';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IPartialModel } from '@shared/interfaces/generics/domain-partial-model.interface';
import { DateOpenInterval } from '@shared/models/date/date-open-interval';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Result } from '@shared/models/generics/result';

export class ProjectTimeline implements IPartialModel<ProjectTimelineEntity> {
    readonly period: DateOpenInterval;
    readonly deadline: OptionalDate;
    readonly status: ProjectStatus;

    private constructor(data: IProjectTimeline) {
        this.period = data.period ?? DateOpenInterval.empty();
        this.deadline = data.deadline ?? OptionalDate.empty();
        this.status = data.status ?? ProjectStatus.draft();
    }

    static create(payload: CreateProjectTimelineDto): Result<ProjectTimeline> {
        const data = Result.aggregateObjects<Pick<IProjectTimeline, 'period' | 'deadline'>>(
            { period: DateOpenInterval.create( payload.startDate, payload.endDate, 'startDate', 'endDate' ) },
            { deadline: OptionalDate.create( payload.deadline, 'deadline' ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        const buildData = data.value!;

        if( buildData.deadline!.isSet() && !buildData.deadline!.isFutureDate() ) {
            return Failed( new NotFutureDateException( 'deadline' ) );
        }

        const status = ProjectStatus.defineStatus( buildData.period );

        return Success( new ProjectTimeline( { ...buildData, status: status } ) );
    }

    static fromEntity(entity: ProjectTimelineEntity): Result<ProjectTimeline> {
        const data = Result.aggregateObjects<IProjectTimeline>(
            { period: DateOpenInterval.create( entity.startDate, entity.endDate, 'startDate', 'endDate' ) },
            { deadline: OptionalDate.create( entity.deadline, 'deadline' ) },
            { status: ProjectStatus.create( entity.status ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new ProjectTimeline( data.value! ) );
    }

    static empty(): ProjectTimeline {
        return new ProjectTimeline( {} );
    }

    toEntity(): ProjectTimelineEntity {
        return {
            startDate: this.period.from.getValue(),
            endDate  : this.period.to.getValue(),
            deadline : this.deadline.getValue(),
            status   : this.status.getValue()
        };
    }

    update(payload: UpdateProjectTimelineDto): Result<ProjectTimeline> {
        const buildData = Result.aggregateObjects<Pick<IProjectTimeline, 'period' | 'deadline' | 'status'>>(
            { period: this.period.update( payload.startDate, payload.endDate ) },
            { deadline: this.deadline.update( payload.deadline, 'deadline' ) },
            { status: ProjectStatus.defineStatus( this.period ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new ProjectTimeline( { ...buildData.value! } ) );
    }
}
