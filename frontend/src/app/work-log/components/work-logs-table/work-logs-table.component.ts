import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppR } from '@shared/constants/routes';
import { PaginatedResultDto } from '@dtos/paginated-result.dto';
import { ProjectDto } from '@dtos/project.dto';
import { UserDto } from '@dtos/user.dto';
import { WorkLogDto } from '@dtos/work-log.dto';
import { BasePaginatedTable } from '@shared/directives/base-paginated-table.directive';
import { TableColumns } from '@shared/directives/base-table.directive';
import { UpdateWorkLogFormComponent } from '@work-log/components/update-work-log-form/update-work-log-form.component';
import { WorkLogUiEvents } from '@work-log/store/work-log/work-log-ui.events';
import { WorkLogSelectors } from '@work-log/store/work-log/work-log.selectors';
import { WorkLogState } from '@work-log/store/work-log/work-log.store';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                selector   : 'app-work-logs-table',
                templateUrl: './work-logs-table.component.html',
                styleUrls  : [ './work-logs-table.component.scss' ]
            } )
@UntilDestroy()
export class WorkLogsTableComponent extends BasePaginatedTable<WorkLogDto, WorkLogState> implements OnInit, OnDestroy {
    @Input() showUser!: boolean;
    @Input() updateEnabled = true;

    override columns: TableColumns<WorkLogDto> = [];
    override pagination$!: Observable<PaginatedResultDto | null>;

    constructor(
        private workLogSelectors: WorkLogSelectors,
        private workLogUiEvents: WorkLogUiEvents,
        private dialog: MatDialog,
        private router: Router
    ) {
        super( workLogSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.setColumns();
        this.pagination$ = this.workLogSelectors.selectPagination();
    }

    ngOnDestroy(): void {
        this.workLogUiEvents.onWorkLogsTableClosed();
    }

    openUpdateWorkLogDialog(workLog: WorkLogDto): void {
        if( this.updateEnabled ) {
            this.dialog.open( UpdateWorkLogFormComponent,
                              {
                                  width: '500px',
                                  data : { workLog }
                              } );
        }
    }

    async goToProjectPage(project: ProjectDto): Promise<void> {
        await this.router.navigateByUrl( `${ AppR.project.list.full }/${ project.id }` );
    }

    async goToUserPage(user: UserDto): Promise<void> {
        await this.router.navigateByUrl( `${ AppR.user.list.full }/${ user.id }` );
    }

    private setColumns(): void {
        this.columns = [
            'date',
            'project',
            'minutesLogged'
        ];

        if( this.showUser ) {
            this.columns.push( 'employee' );
        }

        if( this.updateEnabled ) {
            this.columns.push( 'actions' );
        }
    }
}
