import { Injectable } from '@angular/core';
import { CreateProjectInfoDto } from '@dtos/create-project-info.dto';
import { CreateProjectTimelineDto } from '@dtos/create-project-timeline.dto';
import { CreateProjectDto } from '@dtos/create-project.dto';
import { ProjectDto } from '@dtos/project.dto';
import { ProjectState, ProjectStore } from '@project/store/project.store';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { BaseEntitySelector } from '@shared/store/base-entity-selector';
import { map, Observable, zip } from 'rxjs';

@Injectable()
export class ProjectSelectors extends BaseEntitySelector<ProjectDto, ProjectState> {
    constructor(private readonly projectStore: ProjectStore) {
        super( projectStore );
    }

    selectNewProjectInfo(): Observable<CreateProjectInfoDto | null> {
        return this.select( state => state.newProject.info );
    }

    selectNewProjectTimeline(): Observable<CreateProjectTimelineDto | null> {
        return this.select( state => state.newProject.timeline );
    }

    selectNewProjectData(): Observable<CreateProjectDto | null> {
        return zip( this.selectNewProjectInfo(), this.selectNewProjectTimeline() )
            .pipe(
                map( ([ info, timeline ]) => valueIsEmpty( info )
                                             ? null
                                             : { info, timeline: timeline ?? {} } as CreateProjectDto )
            );
    }
}
