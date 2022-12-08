import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { PaginationParamsDto } from '@dtos/pagination-params-dto';
import { ClosedDateInterval } from '@shared/config/constants/shared.types';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { CsvFileDownloadService } from '@shared/features/file-manager/csv-file-download.service';
import { MessageService } from '@shared/features/message/message.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { WorkLogSuccessMessage } from '@work-logs/config/work-log.constants';
import { WorkLogListDataService } from '@work-logs/features/work-log-list/work-log-list-data.service';
import * as dayjs from 'dayjs';
import { UntilDestroy } from 'ngx-reactivetoolkit';

type DisplayType = 'table' | 'timesheet'

@Component( {
                selector       : 'app-work-log-list',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-header>
                            <app-title headerLeft title="Work logs" icon="add_task"></app-title>
                            <ng-container headerRight>
                                <app-file-upload
                                    label="Import csv"
                                    style="margin-right: 10px"
                                    accept=".csv"
                                    [disabled]="true"
                                    (onUpload)="importWorkLogsFromFile($event[0])"></app-file-upload>
                                <app-download-button
                                    appButton
                                    label="Download csv"
                                    [disabled]="data.loading"
                                    (onClick)="downloadWorkLogsCsv()"></app-download-button>
                            </ng-container>
                        </app-header>
                        <app-work-log-list-filters
                            [initialValues]="workLogsParams"
                            [projects]="data.projects"
                            [users]="data.users"
                            [clients]="data.clients"
                            (onFiltersChange)="onWorkLogsFiltersChange($event)"
                            (onProjectInputFocus)="dataService.loadProjects()"
                            (onUserInputFocus)="dataService.loadUsers()"
                            (onClientInputFocus)="dataService.loadClients()"></app-work-log-list-filters>
                        <section class="mb-3">
                            <app-container>
                                <mat-button-toggle-group
                                    [(ngModel)]="displayType"
                                    (valueChange)="onDisplayTypeChange($event)">
                                    <mat-button-toggle value="timesheet">Timesheet</mat-button-toggle>
                                    <mat-button-toggle value="table">List</mat-button-toggle>
                                </mat-button-toggle-group>
                            </app-container>
                        </section>
                        <app-container>
                            <app-work-log-list-table
                                *ngIf="displayType === 'table'"
                                [workLogs]="data.entities"
                                [pagination]="data.pagination"
                                [loading]="data.loading"
                                [showUser]="true"
                                [showEditButton]="false"
                                (onPageChange)="onWorkLogsPageChange($event)"
                                (onUserClick)="navigationService.userDetails($event.id)"
                                (onProjectClick)="navigationService.projectDetails($event.id)"></app-work-log-list-table>
                            <app-work-log-list-timesheet
                                *ngIf="displayType === 'timesheet'"
                                [workLogs]="data.entities"
                                [workLogsLoading]="data.loading"
                                [vacations]="data.vacations"
                                [vacationsLoading]="data.vacationsLoading"
                                [holidays]="data.holidays"
                                [holidaysLoading]="data.holidaysLoading"
                                [dateInterval]="dateInterval"></app-work-log-list-timesheet>
                        </app-container>
                    </ng-container>
                `,
                styles         : [
                    `:host ::ng-deep {

                        .mat-form-field {
                            margin: 0 !important;
                        }

                        .mat-form-field-appearance-outline .mat-form-field-wrapper {
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                    }
                    `
                ],
                providers      : [ WorkLogListDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WorkLogListComponent implements OnInit {
    displayType: DisplayType = 'timesheet';
    workLogsParams: GetPaginatedWorkLogsParamsDto = {};
    dateInterval!: ClosedDateInterval;

    constructor(
        public readonly dataService: WorkLogListDataService,
        public readonly navigationService: NavigationService,
        private csvFileDownloadService: CsvFileDownloadService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
        this.dataService.loadWorkLogs();
        this.setCurrentMonthAsParamsDateInterval();
    }

    onWorkLogsPageChange(pagination: PaginationParamsDto): void {
        this.workLogsParams = { ...this.workLogsParams, ...pagination };
        this.dataService.loadWorkLogs( this.workLogsParams );
    }

    onWorkLogsFiltersChange(filters: GetPaginatedWorkLogsParamsDto): void {
        this.workLogsParams = {
            ...filters,
            pageNumber  : this.workLogsParams.pageNumber,
            itemsPerPage: this.workLogsParams.itemsPerPage
        };
        this.dataService.loadWorkLogs( this.workLogsParams );

        const { fromDate, toDate } = filters;

        if( valueIsEmpty( fromDate ) || valueIsEmpty( toDate ) ) {
            this.displayType = 'table';
            this.onDisplayTypeChange( this.displayType );
        } else {
            this.dateInterval = { fromDate, toDate };
        }
    }

    downloadWorkLogsCsv(): void {
        this.dataService.loadCsvWorkLogs( this.workLogsParams );
        this.dataService.csvWorkLogsSafe.subscribe( csvWorkLogs => {
            const fileName = `alt-hub-work-logs-${ Date.now() }`;
            this.csvFileDownloadService.download( csvWorkLogs, fileName );
        } );
    }

    importWorkLogsFromFile(file: File): void {
        this.dataService.importWorkLogsFromFile( file );
        this.onWorkLogsImportSuccess();
    }

    onDisplayTypeChange(type: DisplayType): void {
        switch( type ) {
            case 'table':
                this.workLogsParams = { ...this.workLogsParams, pageNumber: undefined, itemsPerPage: undefined };
                this.dataService.loadWorkLogs( this.workLogsParams );
                break;
            case 'timesheet':
                if( valueIsEmpty( this.workLogsParams.fromDate ) || valueIsEmpty( this.workLogsParams.toDate ) ) {
                    this.setCurrentMonthAsParamsDateInterval();
                }

                this.workLogsParams = { ...this.workLogsParams, pageNumber: 0, itemsPerPage: 1000 };
                this.dataService.loadWorkLogs( this.workLogsParams );
                this.dataService.loadVacations();
                this.dataService.loadHolidays();
                break;
        }
    }

    private onWorkLogsImportSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.dataService.loadWorkLogs();
            this.messageService.success( WorkLogSuccessMessage.Imported );
        } );
    }

    private setCurrentMonthAsParamsDateInterval(): void {
        this.workLogsParams = {
            ...this.workLogsParams,
            fromDate: dayjs()
                .startOf( 'month' )
                .toDate()
                .toISOString(),
            toDate  : dayjs()
                .endOf( 'month' )
                .toDate()
                .toISOString()
        };
        this.dateInterval = { fromDate: this.workLogsParams.fromDate!, toDate: this.workLogsParams.toDate! };
    }
}
