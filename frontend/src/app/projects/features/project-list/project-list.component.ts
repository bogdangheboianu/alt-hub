import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProjectListDataService } from '@projects/features/project-list/project-list-data.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-project-list',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-header>
                            <app-title headerLeft title="Projects" icon="assignment"></app-title>
                            <app-create-button appButton headerRight *isAdmin (onClick)="navigationService.projectCreate()"></app-create-button>
                        </app-header>
                        <app-container>
                            <app-project-list-table [projects]="data.entities"
                                                    [loading]="data.loading"
                                                    [disableClientLinks]="!data.isAdmin"
                                                    [disableUserLinks]="!data.isAdmin"
                                                    (onRowClick)="navigationService.projectDetails($event.id)"
                                                    (onClientClick)="navigationService.clientDetails($event.id)"
                                                    (onUserClick)="navigationService.userDetails($event.id)"></app-project-list-table>
                        </app-container>
                    </ng-container>
                `,
                providers      : [ ProjectListDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectListComponent implements OnInit {
    constructor(
        public readonly dataService: ProjectListDataService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }
}
