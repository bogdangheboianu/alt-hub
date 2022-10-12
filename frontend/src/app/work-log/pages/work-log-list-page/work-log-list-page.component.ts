import { Component, OnInit } from '@angular/core';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params.dto';
import { PaginationParamsDto } from '@dtos/pagination-params.dto';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { CsvFileDownloadService } from '@shared/services/csv-file-download.service';
import { WorkLogActions } from '@work-log/store/work-log/work-log.actions';
import { WorkLogSelectors } from '@work-log/store/work-log/work-log.selectors';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { filter } from 'rxjs';

@Component( {
                selector   : 'app-work-log-list-page',
                templateUrl: './work-log-list-page.component.html',
                styleUrls  : [ './work-log-list-page.component.scss' ]
            } )
@UntilDestroy()
export class WorkLogListPageComponent implements OnInit {
    workLogsParams: GetPaginatedWorkLogsParamsDto = {};

    constructor(
        private workLogActions: WorkLogActions,
        private workLogSelectors: WorkLogSelectors,
        private csvFileDownloadService: CsvFileDownloadService
    ) {
    }

    ngOnInit(): void {
        this.loadPaginatedWorkLogs();
    }

    onWorkLogsPageChange(pagination: PaginationParamsDto): void {
        this.workLogsParams = { ...this.workLogsParams, ...pagination };
        this.loadPaginatedWorkLogs();
    }

    onWorkLogsFiltersChange(filters: GetPaginatedWorkLogsParamsDto): void {
        this.workLogsParams = {
            ...filters,
            pageNumber  : this.workLogsParams.pageNumber,
            itemsPerPage: this.workLogsParams.itemsPerPage
        };
        this.loadPaginatedWorkLogs();
    }

    handleWorkLogsCsvExport(): void {
        this.workLogActions.loadAllCsvWorkLogs( { ...this.workLogsParams } );
        this.workLogSelectors.selectCsvWorkLogs()
            .pipe(
                takeUntilDestroy( this ),
                filter( valueIsNotEmpty )
            )
            .subscribe( csvWorkLogs => {
                const fileName = `alt-hub-work-logs-${ Date.now() }`;
                this.csvFileDownloadService.download( csvWorkLogs, fileName );
            } );
    }

    private loadPaginatedWorkLogs(): void {
        this.workLogActions.loadPaginatedWorkLogs( this.workLogsParams );
    }
}
