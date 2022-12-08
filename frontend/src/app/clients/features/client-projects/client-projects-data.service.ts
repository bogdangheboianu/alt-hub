import { Injectable } from '@angular/core';
import { ClientSelectors } from '@clients/data/client.selectors';
import { ClientDto } from '@dtos/client-dto';
import { ProjectDto } from '@dtos/project-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';

export interface ClientProjectsComponentData {
    projects: ProjectDto[];
    projectsLoading: boolean;
}

@Injectable()
export class ClientProjectsDataService extends DetailsComponentDataService<ClientDto, ClientProjectsComponentData> {
    constructor(
        private readonly clientSelectors: ClientSelectors,
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors
    ) {
        super( clientSelectors );
    }

    protected override onInit(): void {
        this.loadClientProjects();
    }

    protected override dataSource(): ComponentDataSource<ClientProjectsComponentData> {
        return {
            projects       : this.projectSelectors.selectAll(),
            projectsLoading: this.projectSelectors.selectLoading()
        };
    }

    private loadClientProjects(): void {
        this.entity$.subscribe( client => this.projectActions.loadAllProjects( { clientId: client.id } ) );
    }
}
