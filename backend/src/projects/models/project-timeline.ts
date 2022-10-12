import { CreateProjectTimelineDto } from '@projects/dtos/create-project-timeline.dto';
import { IProjectTimeline } from '@projects/interfaces/project-timeline.interface';
import { ProjectStatus } from '@projects/models/project-status';
import { ProjectTimelineEntity } from '@projects/types/project.types';
import { NotFutureDateException } from '@shared/exceptions/date.exceptions';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IPartialModel } from '@shared/interfaces/generics/domain-partial-model.interface';
import { DateOpenInterval } from '@shared/models/date/date-open-interval';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Result } from '@shared/models/generics/result';

export class ProjectTimeline implements IPartialModel<ProjectTimelineEntity> {
    period: DateOpenInterval;
    deadline: OptionalDate;
    status!: ProjectStatus;

    private constructor(data: IProjectTimeline) {
        this.period = data.period;
        this.deadline = data.deadline;
        this.status = data.status;
    }

    static create(dto: CreateProjectTimelineDto): Result<ProjectTimeline> {
        const data = Result.aggregateObjects<Pick<IProjectTimeline, 'period' | 'deadline'>>(
            { period: DateOpenInterval.create( dto.startDate, dto.endDate, 'startDate', 'endDate' ) },
            { deadline: OptionalDate.create( dto.deadline, 'deadline' ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        const buildData = data.value!;

        if( buildData.deadline!.isSet() && !buildData.deadline!.isFutureDate() ) {
            return Failed( new NotFutureDateException( 'deadline' ) );
        }

        return Success( new ProjectTimeline( { ...buildData, status: this.defineStatus( buildData.period ) } ) );
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

    private static defineStatus(projectPeriod: DateOpenInterval): ProjectStatus {
        if( projectPeriod.isEmpty() || projectPeriod.isInTheFuture() ) {
            return ProjectStatus.draft();
        }

        if( projectPeriod.isInThePast() ) {
            return ProjectStatus.completed();
        }
        
        if( projectPeriod.isCurrent() ) {
            return ProjectStatus.inProgress();
        }

        return ProjectStatus.draft();
    }

    toEntity(): ProjectTimelineEntity {
        return {
            startDate: this.period.from.getValue(),
            endDate  : this.period.to.getValue(),
            deadline : this.deadline.getValue(),
            status   : this.status.getValue()
        };
    }
}
