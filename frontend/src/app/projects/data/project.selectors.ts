import { Injectable } from '@angular/core';
import { BaseEntitySelector } from '@config/store/store.models';
import { ProjectDto } from '@dtos/project-dto';
import { projectsToSelectInputOptions } from '@projects/config/project.mappers';
import { ProjectState, ProjectStore } from '@projects/data/project.store';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { map, Observable } from 'rxjs';

@Injectable()
export class ProjectSelectors extends BaseEntitySelector<ProjectDto, ProjectState> {
    constructor(private readonly projectStore: ProjectStore) {
        super( projectStore );
    }

    selectAllAsSelectInputOptions(): Observable<SelectInputOptions> {
        return this.selectAll()
                   .pipe( map( projectsToSelectInputOptions ) );
    }
}
