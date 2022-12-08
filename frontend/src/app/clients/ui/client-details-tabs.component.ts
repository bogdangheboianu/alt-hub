import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientDocumentsComponent } from '@clients/features/client-documents/client-documents.component';
import { ClientProjectsComponent } from '@clients/features/client-projects/client-projects.component';
import { ClientWorkLogsComponent } from '@clients/features/client-work-logs/client-work-logs.component';
import { getQueryParamFromRoute } from '@shared/config/functions/route.functions';
import { ContainerComponent } from '@shared/ui/container.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';

enum ClientDetailsTab {
    WorkLogs  = 'work-logs',
    Projects  = 'projects',
    Documents = 'documents'
}

const TAB_ROUTE_QUERY_PARAM = 'tab';

@Component( {
                standalone     : true,
                selector       : 'app-client-details-tabs',
                template       : `
                    <app-container>
                        <mat-tab-group
                            mat-stretch-tabs
                            [(selectedIndex)]="selectedIndex"
                            (selectedIndexChange)="onSelectedIndexChange($event)">
                            <mat-tab label="Work logs">
                                <app-client-work-logs></app-client-work-logs>
                            </mat-tab>
                            <mat-tab label="Projects">
                                <app-client-projects></app-client-projects>
                            </mat-tab>
                            <mat-tab label="Documents">
                                <app-client-documents></app-client-documents>
                            </mat-tab>
                        </mat-tab-group>
                    </app-container>
                `,
                imports        : [
                    ContainerComponent,
                    MatTabsModule,
                    ClientProjectsComponent,
                    ClientWorkLogsComponent,
                    ClientDocumentsComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientDetailsTabsComponent implements OnInit {
    tabs: string[] = Object.values( ClientDetailsTab );
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
