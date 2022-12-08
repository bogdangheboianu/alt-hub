import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { ProjectWorkLogsDataService } from '@projects/features/project-work-logs/project-work-logs-data.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { ContainerComponent } from '@shared/ui/container.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { WorkLogDataModule } from '@work-logs/data/work-log-data.module';
import { WorkLogListTableComponent } from '@work-logs/ui/work-log-list-table.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-project-work-logs',
                template       : `
                    <app-container *ngIf="(dataService.data$ | async)! as data">
                        <app-section-title
                            title="Work logs"
                            icon="add_task"
                            [withMarginBottom]="true"></app-section-title>
                        <app-work-log-list-table
                            [workLogs]="data.workLogs"
                            [loading]="data.workLogsLoading"
                            [pagination]="data.workLogsPagination"
                            [showProject]="false"
                            [showUser]="true"
                            [showEditButton]="false"
                            (onPageChange)="dataService.loadProjectWorkLogs($event)"
                            (onUserClick)="navigationService.userDetails($event.id)"></app-work-log-list-table>
                    </app-container>
                `,
                providers      : [ ProjectWorkLogsDataService ],
                imports        : [
                    CommonModule,
                    ProjectDataModule,
                    WorkLogDataModule,
                    ContainerComponent,
                    SectionTitleComponent,
                    WorkLogListTableComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectWorkLogsComponent implements OnInit {
    constructor(
        public readonly dataService: ProjectWorkLogsDataService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }
}
