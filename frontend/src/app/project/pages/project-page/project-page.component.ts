import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientDto } from '@dtos/client.dto';
import { ProjectDto } from '@dtos/project.dto';
import { ProjectActions } from '@project/store/project.actions';
import { ProjectSelectors } from '@project/store/project.selectors';
import { AppR } from '@shared/constants/routes';
import { getParamFromRoute } from '@shared/functions/get-from-route.function';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                selector   : 'app-project-page',
                templateUrl: './project-page.component.html',
                styleUrls  : [ './project-page.component.scss' ]
            } )
@UntilDestroy()
export class ProjectPageComponent implements OnInit {
    project$!: Observable<ProjectDto | undefined>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors
    ) {
    }

    ngOnInit(): void {
        this.loadProject();
        this.project$ = this.projectSelectors.selectActive();
    }

    async goToClientPage(client: ClientDto): Promise<void> {
        await this.router.navigateByUrl( `${ AppR.client.list.full }/${ client.id }` );
    }

    private loadProject(): void {
        getParamFromRoute( 'id', this.route )
            .pipe( takeUntilDestroy( this ) )
            .subscribe( id => this.projectActions.loadProjectById( id ) );
    }
}
