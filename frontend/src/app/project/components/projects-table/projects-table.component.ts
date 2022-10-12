import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientDto } from '@dtos/client.dto';
import { ProjectDto } from '@dtos/project.dto';
import { UserDto } from '@dtos/user.dto';
import { ProjectSelectors } from '@project/store/project.selectors';
import { ProjectState } from '@project/store/project.store';
import { AppR } from '@shared/constants/routes';
import { BaseTable, TableColumns } from '@shared/directives/base-table.directive';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-projects-table',
                templateUrl: './projects-table.component.html',
                styleUrls  : [ './projects-table.component.scss' ]
            } )
@UntilDestroy()
export class ProjectsTableComponent extends BaseTable<ProjectDto, ProjectState> {
    constructor(
        private projectSelectors: ProjectSelectors,
        private router: Router
    ) {
        super( projectSelectors );
    }

    override get columns(): TableColumns<ProjectDto> {
        return [ 'name', 'clientName', 'status', 'coordinator' ];
    }

    async goToProjectPage(project: ProjectDto): Promise<void> {
        await this.router.navigateByUrl( `${ AppR.project.list.full }/${ project.id }` );
    }

    async goToClientPage(client: ClientDto): Promise<void> {
        await this.router.navigateByUrl( `${ AppR.client.list.full }/${ client.id }` );
    }

    async goToUserPage(user: UserDto): Promise<void> {
        await this.router.navigateByUrl( `${ AppR.user.list.full }/${ user.id }` );
    }
}
