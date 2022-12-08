import { Injectable } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { ProjectDto } from '@dtos/project-dto';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectTimelineDataService extends DetailsComponentDataService<ProjectDto, {}> {
    constructor(
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors,
        private readonly authSelectors: AuthSelectors
    ) {
        super( projectSelectors );
    }

    updateProjectTimeline(data: UpdateProjectTimelineDto): void {
        this.entity.then( project => this.projectActions.updateProjectTimeline( project.id, data ) );
    }

    projectTimelineIsUpdatable(): Observable<boolean> {
        return this.authSelectors.isLoggedUserAdmin();
    }

    protected override onInit(): void {
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }
}
