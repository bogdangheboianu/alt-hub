import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ClientProjectsDataService } from '@clients/features/client-projects/client-projects-data.service';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { ProjectListTableComponent } from '@projects/ui/project-list-table.component';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-client-projects',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <div class="p-3">
                            <app-section-title title="Projects" icon="assignment"></app-section-title>
                            <app-project-list-table
                                [projects]="data.projects"
                                [loading]="data.projectsLoading"
                                [showClientColumn]="false"
                                (onRowClick)="navigationService.projectDetails($event.id)"
                                (onUserClick)="navigationService.userDetails($event.id)"></app-project-list-table>
                        </div>
                    </ng-container>
                `,
                imports        : [
                    ClientDataModule,
                    ProjectDataModule,
                    CommonModule,
                    ProjectListTableComponent,
                    SectionTitleComponent
                ],
                providers      : [ ClientProjectsDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientProjectsComponent implements OnInit {
    constructor(
        public readonly dataService: ClientProjectsDataService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }
}
