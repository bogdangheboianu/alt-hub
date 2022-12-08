import { Injectable } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { ProjectDto } from '@dtos/project-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { ListComponentDataService } from '@shared/data/list-component-data.service';

interface ProjectListComponentData {
    isAdmin: boolean;
}

@Injectable()
export class ProjectListDataService extends ListComponentDataService<ProjectDto, ProjectListComponentData> {

    constructor(
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors,
        private readonly authSelectors: AuthSelectors
    ) {
        super( projectSelectors );
    }

    protected override onInit(): void {
        this.loadProjects();
    }

    protected override dataSource(): ComponentDataSource<ProjectListComponentData> {
        return {
            isAdmin: this.authSelectors.isLoggedUserAdmin()
        };
    }

    private loadProjects(): void {
        this.projectActions.loadAllProjects();
    }
}
