import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { getQueryParamFromRoute } from '@shared/config/functions/route.functions';
import { ContainerComponent } from '@shared/ui/container.component';
import { UserDocumentsComponent } from '@users/features/user-documents/user-documents.component';
import { UserVacationsComponent } from '@users/features/user-vacations/user-vacations.component';
import { UserWorkLogsComponent } from '@users/features/user-work-logs/user-work-logs.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';

enum UserDetailsTab {
    WorkLogs  = 'work-logs',
    Vacations = 'vacations',
    Documents = 'documents'
}

const TAB_ROUTE_QUERY_PARAM = 'tab';

@Component( {
                standalone     : true,
                selector       : 'app-user-details-tabs',
                template       : `
                    <app-container>
                        <mat-tab-group
                            mat-stretch-tabs
                            [(selectedIndex)]="selectedIndex"
                            (selectedIndexChange)="onSelectedIndexChange($event)">
                            <mat-tab label="Work logs">
                                <app-user-work-logs></app-user-work-logs>
                            </mat-tab>
                            <mat-tab label="Vacations">
                                <app-user-vacations></app-user-vacations>
                            </mat-tab>
                            <mat-tab label="Documents">
                                <app-user-documents></app-user-documents>
                            </mat-tab>
                        </mat-tab-group>
                    </app-container>
                `,
                imports        : [
                    ContainerComponent,
                    MatTabsModule,
                    UserWorkLogsComponent,
                    UserVacationsComponent,
                    UserDocumentsComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserDetailsTabsComponent implements OnInit {
    tabs: string[] = Object.values( UserDetailsTab );
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
