import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ClientWorkLogsDataService } from '@clients/features/client-work-logs/client-work-logs-data.service';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { PaginationParamsDto } from '@dtos/pagination-params-dto';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { CsvFileDownloadService } from '@shared/features/file-manager/csv-file-download.service';
import { FileManagerModule } from '@shared/features/file-manager/file-manager.module';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { ButtonModule } from '@shared/ui/button/button.module';
import { DownloadButtonComponent } from '@shared/ui/button/download-button.component';
import { ExpansionPanelComponent } from '@shared/ui/expansion-panel.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { UserDataModule } from '@users/data/user-data.module';
import { WorkLogDataModule } from '@work-logs/data/work-log-data.module';
import { WorkLogListFiltersComponent } from '@work-logs/ui/work-log-list-filters.component';
import { WorkLogListTableComponent } from '@work-logs/ui/work-log-list-table.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { combineLatest } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-client-work-logs',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <div class="p-3">
                            <div class="py-3 d-flex align-items-center justify-content-between">
                                <app-section-title title="Work logs" icon="add_task" [withMarginBottom]="false"></app-section-title>
                                <app-download-button
                                    appButton
                                    label="Download csv"
                                    class="mx-1"
                                    [outlined]="true"
                                    (onClick)="downloadWorkLogsCsv()"></app-download-button>
                            </div>
                            <app-work-log-list-filters
                                [projects]="data.projects"
                                [users]="data.users"
                                [showTitle]="false"
                                [showClientsFilter]="false"
                                [noBackground]="true"
                                [withMarginBottom]="false"
                                (onFiltersChange)="onWorkLogsFiltersChange($event)"
                                (onProjectInputFocus)="dataService.loadClientProjects()"
                                (onUserInputFocus)="dataService.loadUsers()"></app-work-log-list-filters>
                            <app-work-log-list-table
                                [workLogs]="data.workLogs"
                                [pagination]="data.workLogsPagination"
                                [loading]="data.workLogsLoading"
                                [showUser]="false"
                                [showEditButton]="false"
                                (onPageChange)="onWorkLogListPageChange($event)"
                                (onUserClick)="navigationService.userDetails($event.id)"
                                (onProjectClick)="navigationService.projectDetails($event.id)"></app-work-log-list-table>
                        </div>
                    </ng-container>
                `,
                providers      : [ ClientWorkLogsDataService ],
                imports        : [
                    CommonModule,
                    ClientDataModule,
                    WorkLogDataModule,
                    ProjectDataModule,
                    UserDataModule,
                    DownloadButtonComponent,
                    ButtonModule,
                    MatDividerModule,
                    ExpansionPanelComponent,
                    WorkLogListFiltersComponent,
                    WorkLogListTableComponent,
                    FileManagerModule,
                    SectionTitleComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientWorkLogsComponent implements OnInit {
    workLogsParams: GetPaginatedWorkLogsParamsDto = {};

    constructor(
        public readonly dataService: ClientWorkLogsDataService,
        public readonly navigationService: NavigationService,
        private readonly csvFileDownloadService: CsvFileDownloadService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    onWorkLogListPageChange(pagination: PaginationParamsDto): void {
        this.workLogsParams = {
            ...this.workLogsParams,
            pageNumber  : pagination.pageNumber,
            itemsPerPage: pagination.itemsPerPage
        };
        this.dataService.loadWorkLogs( this.workLogsParams );
    }

    onWorkLogsFiltersChange(filters: GetPaginatedWorkLogsParamsDto): void {
        this.workLogsParams = {
            ...filters,
            pageNumber  : this.workLogsParams.pageNumber,
            itemsPerPage: this.workLogsParams.itemsPerPage
        };
        this.dataService.loadWorkLogs( this.workLogsParams );
    }

    downloadWorkLogsCsv(): void {
        let downloaded = false;
        this.dataService.loadCsvWorkLogs( { ...this.workLogsParams } );
        combineLatest( [ this.dataService.entity$, this.dataService.source!.csvWorkLogs ] )
            .pipe( takeUntilDestroy( this ) )
            .subscribe( ([ client, csvWorkLogs ]) => {
                const clientName = client.name.toLowerCase()
                                         .replace( ' ', '-' );
                const fileName = `alt-hub-work-logs-${ clientName }-${ Date.now() }`;

                if( !downloaded ) {
                    this.csvFileDownloadService.download( csvWorkLogs, fileName );
                    downloaded = true;
                }
            } );
    }
}
