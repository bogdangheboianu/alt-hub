import { Injectable } from '@angular/core';
import { ClientActions } from '@clients/data/client.actions';
import { ClientSelectors } from '@clients/data/client.selectors';
import { CreateProjectDto } from '@dtos/create-project-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';

interface ProjectCreateComponentData {
    clientOptions: SelectInputOptions;
    clientOptionsLoading: boolean;
}

@Injectable()
export class ProjectCreateDataService extends BaseComponentDataService<ProjectCreateComponentData> {
    constructor(
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors,
        private readonly clientActions: ClientActions,
        private readonly clientSelectors: ClientSelectors
    ) {
        super( projectSelectors );
    }

    override onInit(): void {
        this.loadClients();
    }

    create(data: CreateProjectDto): void {
        this.projectActions.createProject( data );
    }

    protected override dataSource(): ComponentDataSource<ProjectCreateComponentData> {
        return {
            clientOptions       : this.clientSelectors.selectAllAsSelectInputOptions(),
            clientOptionsLoading: this.clientSelectors.selectLoading()
        };
    }

    private loadClients(): void {
        this.clientActions.loadAllClients();
    }
}
