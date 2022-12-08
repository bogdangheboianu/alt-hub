import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectMembersComponent } from '@projects/features/project-members/project-members.component';
import { ProjectWorkLogsComponent } from '@projects/features/project-work-logs/project-work-logs.component';
import { getQueryParamFromRoute } from '@shared/config/functions/route.functions';
import { ContainerComponent } from '@shared/ui/container.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { UserVacationsComponent } from '@users/features/user-vacations/user-vacations.component';
import { UserWorkLogsComponent } from '@users/features/user-work-logs/user-work-logs.component';
import { WorkLogListTableComponent } from '@work-logs/ui/work-log-list-table.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';

enum ProjectDetailsTab {
    Members  = 'members',
    WorkLogs = 'work-logs'
}

const TAB_ROUTE_QUERY_PARAM = 'tab';

@Component( {
                standalone     : true,
                selector       : 'app-project-details-tabs',
                template       : `
                    <app-container>
                        <mat-tab-group
                            mat-stretch-tabs
                            [(selectedIndex)]="selectedIndex"
                            (selectedIndexChange)="onSelectedIndexChange($event)">
                            <mat-tab label="Members">
                                <app-project-members></app-project-members>
                            </mat-tab>
                            <mat-tab label="Work logs">
                                <app-project-work-logs></app-project-work-logs>
                            </mat-tab>
                        </mat-tab-group>
                    </app-container>
                `,
                imports        : [
                    ContainerComponent,
                    MatTabsModule,
                    UserWorkLogsComponent,
                    UserVacationsComponent,
                    ProjectMembersComponent,
                    SectionTitleComponent,
                    WorkLogListTableComponent,
                    ProjectWorkLogsComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectDetailsTabsComponent implements OnInit {
    tabs: string[] = Object.values( ProjectDetailsTab );
    selectedIndex = 0;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
    }

    ngOnInit(): void {
        this.setSelectedIndex();
    }

    async onSelectedIndexChange(index: number): Promise<void> {
        await this.router.navigate( [], {
            relativeTo        : this.route,
            queryParams       : { [TAB_ROUTE_QUERY_PARAM]: this.tabs[index] },
            skipLocationChange: false,
            replaceUrl        : true
        } );
    }

    private setSelectedIndex(): void {
        getQueryParamFromRoute( TAB_ROUTE_QUERY_PARAM, this.route )
            .pipe( takeUntilDestroy( this ) )
            .subscribe( tab => {
                const tabIndex = this.tabs.indexOf( tab );
                this.selectedIndex = tabIndex !== -1
                                     ? tabIndex
                                     : 0;
            } );
    }
}
