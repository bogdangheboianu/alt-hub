import { Injectable } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { ClientActions } from '@clients/data/client.actions';
import { ClientSelectors } from '@clients/data/client.selectors';
import { ProjectDto } from '@dtos/project-dto';
import { UpdateProjectInfoDto } from '@dtos/update-project-info-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';

interface ProjectDetailsComponentData {
    clientOptions: SelectInputOptions;
    clientOptionsLoading: boolean;
    isAdmin: boolean;
}

@Injectable()
export class ProjectDetailsDataService extends DetailsComponentDataService<ProjectDto, ProjectDetailsComponentData> {
    constructor(
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors,
        private readonly clientActions: ClientActions,
        private readonly clientSelectors: ClientSelectors,
        private readonly authSelectors: AuthSelectors
    ) {
        super( projectSelectors );
    }

    override onInit(): void {
        this.loadProject();
    }

    updateProjectInfo(data: UpdateProjectInfoDto): void {
        this.entity.then( project => this.projectActions.updateProjectInfo( project.id, data ) );
    }

    deleteProject(): void {
        this.entity.then( project => this.projectActions.deleteProject( project.id ) );
    }

    loadClients(): void {
        this.clientActions.loadAllClients();
    }

    protected override dataSource(): ComponentDataSource<ProjectDetailsComponentData> {
        return {
            clientOptions       : this.clientSelectors.selectAllAsSelectInputOptions(),
            clientOptionsLoading: this.clientSelectors.selectLoading(),
            isAdmin             : this.authSelectors.isLoggedUserAdmin()
        };
    }

    private loadProject(): void {
        this.getIdFromRoute()
            .subscribe( id => this.projectActions.loadProjectById( id ) );
    }
}
