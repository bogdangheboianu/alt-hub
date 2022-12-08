import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatedResultDto } from '@dtos/paginated-result-dto';
import { PaginationParamsDto } from '@dtos/pagination-params-dto';
import { ProjectDto } from '@dtos/project-dto';
import { UserDto } from '@dtos/user-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { DEFAULT_ITEMS_PER_PAGE } from '@shared/config/constants/shared.constants';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { ButtonModule } from '@shared/ui/button/button.module';
import { EditButtonComponent } from '@shared/ui/button/edit-button.component';
import { LinkButtonComponent } from '@shared/ui/button/link-button.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { WorkLogUiEvents } from '@work-logs/data/work-log-ui.events';
import { WorkLogPipesModule } from '@work-logs/pipes/work-log-pipes.module';

@Component( {
                standalone     : true,
                selector       : 'app-work-log-list-table',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <div class="table-container">
                        <table mat-table [dataSource]="dataSource" class="darker-header" style="height: 100%">
                            <ng-container matColumnDef="date">
                                <th mat-header-cell *matHeaderCellDef> Date</th>
                                <td mat-cell *matCellDef="let workLog">
                                    <div class="flex align-items-center justify-content-start">
                                        <span style="margin-right: 5px">{{ workLog['date'] | readableDate }}</span>
                                        <mat-icon
                                            *ngIf="workLog['recurrence']"
                                            class="recurrence-icon"
                                            matTooltip="Recurrent"
                                            matTooltipPosition="right">repeat_on
                                        </mat-icon>
                                    </div>
                                </td>
                            </ng-container>
                            <ng-container matColumnDef="minutesLogged">
                                <th mat-header-cell *matHeaderCellDef> Time worked</th>
                                <td mat-cell *matCellDef="let workLog"> {{ workLog['minutesLogged'] | minutesToReadableTime }} </td>
                            </ng-container>
                            <ng-container *ngIf="showProject" matColumnDef="project">
                                <th mat-header-cell *matHeaderCellDef> Project</th>
                                <td mat-cell *matCellDef="let workLog">
                                    <app-link-button
                                        appButton *ngIf="workLog['project']; else projectName"
                                        [label]="workLog | workLogProjectName"
                                        (onClick)="projectClicked(workLog['project'])"></app-link-button>
                                    <ng-template #projectName><span style="text-decoration: line-through">{{ workLog['projectName'] }}</span></ng-template>
                                </td>
                            </ng-container>
                            <ng-container *ngIf="showUser" matColumnDef="user">
                                <th mat-header-cell *matHeaderCellDef> Employee</th>
                                <td mat-cell *matCellDef="let workLog">
                                    <app-link-button
                                        appButton
                                        *ngIf="workLog['user']; else userFullName"
                                        [label]="workLog | workLogUserFullName"
                                        (onClick)="userClicked(workLog['user'])"></app-link-button>
                                    <ng-template #userFullName><span style="text-decoration: line-through">{{ workLog['userFullName'] }}</span></ng-template>
                                </td>
                            </ng-container>
                            <ng-container *ngIf="showEditButton" matColumnDef="actions">
                                <th mat-header-cell *matHeaderCellDef></th>
                                <td mat-cell *matCellDef="let workLog" class="text-end">
                                    <div class="d-flex align-items-center justify-content-end">
                                        <app-edit-button
                                            appButton
                                            [iconOnly]="true"
                                            [disabled]="!workLog['project']"
                                            (click)="editButtonClicked(workLog)"></app-edit-button>
                                    </div>
                                </td>
                            </ng-container>
                            <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
                            <tr mat-row *matRowDef="let workLog; columns: columns;"></tr>
                        </table>
                    </div>
                    <mat-paginator [pageSizeOptions]="pageSizeOptions"
                                   [pageSize]="pageSize"
                                   [length]="totalRecords"
                                   (page)="onPage($event)"
                                   showFirstLastButtons
                                   aria-label="Select page of work logs">
                    </mat-paginator>
                `,
                styles         : [
                    `table {
                        width: 100%;
                    }

                    .table-container {
                        max-height: 500px;
                        max-width: 100%;
                        overflow: auto;
                    }

                    .recurrence-icon {
                        color: #00bd97;
                        font-size: 19px;
                        height: 19px;
                        width: 19px;
                    }
                    `
                ],
                imports        : [
                    CommonModule,
                    MatTableModule,
                    MatIconModule,
                    MatTooltipModule,
                    SharedPipesModule,
                    LinkButtonComponent,
                    ButtonModule,
                    WorkLogPipesModule,
                    EditButtonComponent,
                    MatPaginatorModule,
                    LoadingBarComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class WorkLogListTableComponent implements OnInit, OnDestroy {
    @Input()
    set workLogs(value: WorkLogDto[]) {
        this.dataSource.data = value;
    };

    @Input()
    loading!: boolean;

    @Input()
    set pagination(value: PaginatedResultDto | null) {
        this.totalRecords = value?.totalRecords ?? 0;
    }

    @Input()
    showEditButton = true;

    @Input()
    showUser = true;

    @Input()
    showProject = true;

    @Output()
    onPageChange = new EventEmitter<PaginationParamsDto>();

    @Output()
    onEdit = new EventEmitter<WorkLogDto>();

    @Output()
    onDelete = new EventEmitter<WorkLogDto>();

    @Output()
    onProjectClick = new EventEmitter<ProjectDto>();

    @Output()
    onUserClick = new EventEmitter<UserDto>();

    dataSource = new MatTableDataSource<WorkLogDto>( [] );
    totalRecords = 0;
    pageSize = DEFAULT_ITEMS_PER_PAGE;
    pageSizeOptions = [ 5, 10, 20, 40, 80 ];
    columns!: string[];

    constructor(private readonly uiEvents: WorkLogUiEvents) {
    }

    ngOnInit(): void {
        this.columns = this.getColumns();
    }

    ngOnDestroy(): void {
        this.uiEvents.onWorkLogsTableClosed();
    }

    onPage(event: PageEvent): void {
        this.onPageChange.emit( {
                                    pageNumber  : event.pageIndex,
                                    itemsPerPage: event.pageSize
                                } );
    }

    editButtonClicked(workLog: WorkLogDto): void {
        this.onEdit.emit( workLog );
    }

    projectClicked(project: ProjectDto): void {
        this.onProjectClick.emit( project );
    }

    userClicked(user: UserDto): void {
        this.onUserClick.emit( user );
    }

    private getColumns(): string[] {
        const columns = [ 'date', 'minutesLogged' ];

        if( this.showProject ) {
            columns.push( 'project' );
        }

        if( this.showUser ) {
            columns.push( 'user' );
        }

        if( this.showEditButton ) {
            columns.push( 'actions' );
        }

        return columns;
    }
}
