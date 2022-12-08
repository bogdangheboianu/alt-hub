import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { IsOwnProfilePageModule } from '@auth/directives/is-own-profile-page/is-own-profile-page.module';
import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence-dto';
import { CreateWorkLogsDto } from '@dtos/create-work-logs-dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { PaginationParamsDto } from '@dtos/pagination-params-dto';
import { UpdateWorkLogDto } from '@dtos/update-work-log-dto';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence-dto';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { CsvFileDownloadService } from '@shared/features/file-manager/csv-file-download.service';
import { MessageService } from '@shared/features/message/message.service';
import { ModalModule } from '@shared/features/modal/modal.module';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { ButtonModule } from '@shared/ui/button/button.module';
import { DownloadButtonComponent } from '@shared/ui/button/download-button.component';
import { PrimaryButtonComponent } from '@shared/ui/button/primary-button.component';
import { ExpansionPanelComponent } from '@shared/ui/expansion-panel.component';
import { userFullName } from '@users/config/user.functions';
import { UserDataModule } from '@users/data/user-data.module';
import { UserWorkLogsDataService } from '@users/features/user-work-logs/user-work-logs-data.service';
import { UserPipesModule } from '@users/pipes/user-pipes.module';
import { WorkLogRecurrenceSuccessMessage, WorkLogSuccessMessage } from '@work-logs/config/work-log.constants';
import { WorkLogCreateFormModalData, WorkLogRecurrenceCreateFormModalData, WorkLogRecurrenceUpdateFormModalData, WorkLogUpdateFormModalData } from '@work-logs/config/work-log.interfaces';
import { WorkLogDataModule } from '@work-logs/data/work-log-data.module';
import { WorkLogUiEvents } from '@work-logs/data/work-log-ui.events';
import { WorkLogCreateFormComponent } from '@work-logs/ui/work-log-create-form.component';
import { WorkLogListFiltersComponent } from '@work-logs/ui/work-log-list-filters.component';
import { WorkLogListTableComponent } from '@work-logs/ui/work-log-list-table.component';
import { WorkLogRecurrenceCreateFormComponent } from '@work-logs/ui/work-log-recurrence-create-form.component';
import { WorkLogRecurrenceListTableComponent, WorkLogRecurrenceToggleStatusEvent } from '@work-logs/ui/work-log-recurrence-list-table.component';
import { WorkLogRecurrenceUpdateFormComponent } from '@work-logs/ui/work-log-recurrence-update-form.component';
import { WorkLogUpdateFormComponent } from '@work-logs/ui/work-log-update-form.component';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { combineLatest } from 'rxjs';

type VisibleTable = 'workLogs' | 'workLogRecurrences'

@Component( {
                standalone     : true,
                selector       : 'app-user-work-logs',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <div class="py-3 d-flex align-items-center justify-content-between">
                            <mat-button-toggle-group [(ngModel)]="visibleTable" (valueChange)="onVisibleTableChange($event)" *isOwnProfilePage>
                                <mat-button-toggle value="workLogs">Logged work</mat-button-toggle>
                                <mat-button-toggle value="workLogRecurrences">Recurrences</mat-button-toggle>
                            </mat-button-toggle-group>
                            <div class="d-flex align-items-center justify-content-start">
                                <app-download-button
                                    *ngIf="visibleTable === 'workLogs'"
                                    appButton
                                    label="Download csv"
                                    class="mx-1"
                                    [outlined]="true"
                                    (onClick)="downloadWorkLogsCsv()"></app-download-button>
                                <ng-container *isOwnProfilePage>
                                    <app-primary-button
                                        *ngIf="visibleTable === 'workLogRecurrences'"
                                        appButton
                                        label="Setup recurrent logging"
                                        icon="repeat_on"
                                        class="mx-1"
                                        (onClick)="openWorkLogRecurrenceCreateFormModal()"></app-primary-button>
                                </ng-container>
                                <ng-container *isOwnProfilePage>
                                    <app-primary-button
                                        *ngIf="visibleTable === 'workLogs'"
                                        appButton
                                        label="Log work"
                                        icon="add_task"
                                        class="mx-1"
                                        (onClick)="openWorkLogCreateFormModal()"></app-primary-button>
                                </ng-container>
                            </div>
                        </div>
                        <mat-divider class="mb-4" *ngIf="visibleTable === 'workLogs'"></mat-divider>
                        <app-expansion-panel
                            *ngIf="visibleTable === 'workLogs'"
                            title="Filters"
                            [expanded]="false"
                            [noBackground]="true">
                            <app-work-log-list-filters
                                [projects]="data.projects"
                                [showTitle]="false"
                                [showUsersFilter]="false"
                                [showClientsFilter]="false"
                                [noBackground]="true"
                                (onFiltersChange)="onWorkLogsFiltersChange($event)"
                                (onProjectInputFocus)="dataService.loadProjects()"></app-work-log-list-filters>
                        </app-expansion-panel>
                        <mat-divider class="my-4" *ngIf="visibleTable === 'workLogs'"></mat-divider>
                        <ng-container [ngSwitch]="visibleTable">
                            <app-work-log-list-table
                                *ngSwitchCase="'workLogs'"
                                [workLogs]="data.workLogs"
                                [pagination]="data.workLogsPagination"
                                [loading]="data.workLogsLoading"
                                [showUser]="false"
                                (onPageChange)="onWorkLogListPageChange($event)"
                                (onEdit)="openWorkLogUpdateFormModal($event)"
                                (onUserClick)="navigationService.userDetails($event.id)"
                                (onProjectClick)="navigationService.projectDetails($event.id)"></app-work-log-list-table>
                            <ng-container *isOwnProfilePage>
                                <app-work-log-recurrence-list-table
                                    *ngSwitchCase="'workLogRecurrences'"
                                    [workLogRecurrences]="data.workLogRecurrences"
                                    [loading]="data.workLogRecurrencesLoading"
                                    (onEditButtonClick)="openWorkLogRecurrenceUpdateFormModal($event)"
                                    (onProjectClick)="navigationService.projectDetails($event.id)"
                                    (onToggleStatusClick)="toggleWorkLogRecurrenceStatus($event)"></app-work-log-recurrence-list-table>
                            </ng-container>
                        </ng-container>
                    </ng-container>
                `,
                providers      : [
                    UserWorkLogsDataService,
                    CsvFileDownloadService
                ],
                imports        : [
                    MatButtonToggleModule,
                    FormsModule,
                    CommonModule,
                    WorkLogDataModule,
                    UserDataModule,
                    UserPipesModule,
                    PrimaryButtonComponent,
                    ButtonModule,
                    WorkLogListTableComponent,
                    WorkLogRecurrenceListTableComponent,
                    ProjectDataModule,
                    WorkLogCreateFormComponent,
                    WorkLogUpdateFormComponent,
                    WorkLogRecurrenceCreateFormComponent,
                    WorkLogRecurrenceUpdateFormComponent,
                    ModalModule,
                    IsOwnProfilePageModule,
                    DownloadButtonComponent,
                    WorkLogListFiltersComponent,
                    ExpansionPanelComponent,
                    MatDividerModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserWorkLogsComponent implements OnInit {
    visibleTable: VisibleTable = 'workLogs';
    workLogsParams: GetPaginatedWorkLogsParamsDto = {};

    constructor(
        public readonly dataService: UserWorkLogsDataService,
        private readonly messageService: MessageService,
        private readonly modalService: ModalService,
        public readonly navigationService: NavigationService,
        private readonly workLogUiEvents: WorkLogUiEvents,
        private readonly csvFileDownloadService: CsvFileDownloadService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
        this.handleAutoOpenWorkLogCreateFormModal();
    }

    openWorkLogCreateFormModal(): void {
        this.dataService.loadProjects();
        this.workLogUiEvents.onCreateWorkLogFormOpened();
        this.modalService.openMdModal<WorkLogCreateFormModalData>( WorkLogCreateFormComponent, this, {
            loading$              : this.dataService.source!.workLogsLoading,
            onSubmit              : this.createWorkLog.bind( this ),
            onCancel              : this.closeWorkLogCreateFormModal.bind( this ),
            projectOptions$       : this.dataService.source!.projectOptions,
            projectOptionsLoading$: this.dataService.source!.projectOptionsLoading
        } );
    }

    openWorkLogUpdateFormModal(workLog: WorkLogDto): void {
        this.dataService.loadProjects();
        this.modalService.openMdModal<WorkLogUpdateFormModalData>( WorkLogUpdateFormComponent, this, {
            loading$              : this.dataService.source!.workLogsLoading,
            onSubmit              : (data: UpdateWorkLogDto) => this.updateWorkLog( workLog.id, data ),
            onCancel              : this.closeWorkLogUpdateFormModal.bind( this ),
            onDelete              : () => this.deleteWorkLog( workLog.id ),
            initialValues         : workLog,
            projectOptions$       : this.dataService.source!.projectOptions,
            projectOptionsLoading$: this.dataService.source!.projectOptionsLoading
        } );
    }

    openWorkLogRecurrenceCreateFormModal(): void {
        this.dataService.loadProjects();
        this.modalService.openMdModal<WorkLogRecurrenceCreateFormModalData>( WorkLogRecurrenceCreateFormComponent, this, {
            loading$              : this.dataService.source!.workLogRecurrencesLoading,
            onSubmit              : this.createWorkLogRecurrence.bind( this ),
            onCancel              : this.closeWorkLogRecurrenceCreateFormModal.bind( this ),
            projectOptions$       : this.dataService.source!.projectOptions,
            projectOptionsLoading$: this.dataService.source!.projectOptionsLoading
        } );
    }

    openWorkLogRecurrenceUpdateFormModal(workLogRecurrence: WorkLogRecurrenceDto): void {
        this.modalService.openMdModal<WorkLogRecurrenceUpdateFormModalData>( WorkLogRecurrenceUpdateFormComponent, this, {
            loading$     : this.dataService.source!.workLogRecurrencesLoading,
            onSubmit     : (data: UpdateWorkLogRecurrenceDto) => this.updateWorkLogRecurrence( workLogRecurrence.id, data ),
            onDelete     : () => this.deleteWorkLogRecurrence( workLogRecurrence.id ),
            onCancel     : this.closeWorkLogRecurrenceUpdateFormModal.bind( this ),
            initialValues: workLogRecurrence
        } );
    }

    onWorkLogListPageChange(pagination: PaginationParamsDto): void {
        this.dataService.loadWorkLogs( { ...this.workLogsParams, ...pagination } );
        this.updateWorkLogsParams( { pageNumber: pagination.pageNumber, itemsPerPage: pagination.itemsPerPage } );
    }

    onWorkLogsFiltersChange(filters: GetPaginatedWorkLogsParamsDto): void {
        this.workLogsParams = {
            ...filters,
            pageNumber  : this.workLogsParams.pageNumber,
            itemsPerPage: this.workLogsParams.itemsPerPage
        };
        this.dataService.loadWorkLogs( this.workLogsParams );
    }

    createWorkLog(data: CreateWorkLogsDto): void {
        this.dataService.createWorkLog( data );
        this.onWorkLogCreateSuccess();
    }

    updateWorkLog(id: string, data: UpdateWorkLogDto): void {
        this.dataService.updateWorkLog( id, data );
        this.onWorkLogUpdateSuccess();
    }

    deleteWorkLog(id: string): void {
        this.dataService.deleteWorkLog( id );
        this.onWorkLogDeleteSuccess();
    }

    createWorkLogRecurrence(data: CreateWorkLogRecurrenceDto): void {
        this.dataService.createWorkLogRecurrence( data );
        this.onWorkLogRecurrenceCreateSuccess();
    }

    updateWorkLogRecurrence(id: string, data: UpdateWorkLogRecurrenceDto): void {
        this.dataService.updateWorkLogRecurrence( id, data );
        this.onWorkLogRecurrenceUpdateSuccess();
    }

    deleteWorkLogRecurrence(id: string): void {
        this.dataService.deleteWorkLogRecurrence( id );
        this.onWorkLogRecurrenceDeleteSuccess();
    }

    toggleWorkLogRecurrenceStatus(event: WorkLogRecurrenceToggleStatusEvent): void {
        this.dataService.toggleWorkLogRecurrenceStatus( event );
        this.onWorkLogRecurrenceStatusToggleSuccess();
    }

    onVisibleTableChange(table: VisibleTable): void {
        switch( table ) {
            case 'workLogs':
                this.dataService.loadWorkLogs( this.workLogsParams );
                break;
            case 'workLogRecurrences':
                this.dataService.loadWorkLogRecurrences();
                break;
        }
    }

    closeWorkLogCreateFormModal(): void {
        this.modalService.close( WorkLogCreateFormComponent );
    }

    closeWorkLogUpdateFormModal(): void {
        this.modalService.close( WorkLogUpdateFormComponent );
    }

    closeWorkLogRecurrenceCreateFormModal(): void {
        this.modalService.close( WorkLogRecurrenceCreateFormComponent );
    }

    closeWorkLogRecurrenceUpdateFormModal(): void {
        this.modalService.close( WorkLogRecurrenceUpdateFormComponent );
    }

    updateWorkLogsParams(filters: GetPaginatedWorkLogsParamsDto): void {
        this.workLogsParams = {
            ...this.workLogsParams,
            pageNumber  : filters.pageNumber,
            itemsPerPage: filters.itemsPerPage
        };
    }

    downloadWorkLogsCsv(): void {
        let downloaded = false;
        this.dataService.loadCsvWorkLogs( { ...this.workLogsParams } );
        combineLatest( [ this.dataService.entity$, this.dataService.source!.csvWorkLogs ] )
            .pipe( takeUntilDestroy( this ) )
            .subscribe( ([ user, csvWorkLogs ]) => {
                const userName = userFullName( user )
                    .replace( ' ', '-' )
                    .toLowerCase();
                const fileName = `alt-hub-work-logs-${ userName }-${ Date.now() }`;

                if( !downloaded ) {
                    this.csvFileDownloadService.download( csvWorkLogs, fileName );
                    downloaded = true;
                }
            } );
    }

    private onWorkLogCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.workLogsSuccess, this, () => {
            this.messageService.success( WorkLogSuccessMessage.Created );
            this.dataService.loadWorkLogs( { ...this.workLogsParams } );
            this.closeWorkLogCreateFormModal();
        } );
    }

    private onWorkLogUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.workLogsSuccess, this, () => {
            this.messageService.success( WorkLogSuccessMessage.Updated );
            this.dataService.loadWorkLogs( { ...this.workLogsParams } );
            this.closeWorkLogUpdateFormModal();
        } );
    }

    private onWorkLogDeleteSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.workLogsSuccess, this, () => {
            this.messageService.success( WorkLogSuccessMessage.Deleted );
            this.dataService.loadWorkLogs( { ...this.workLogsParams } );
            this.closeWorkLogUpdateFormModal();
        } );
    }

    private onWorkLogRecurrenceCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.workLogRecurrencesSuccess, this, () => {
            this.messageService.success( WorkLogRecurrenceSuccessMessage.Created );
            this.closeWorkLogRecurrenceCreateFormModal();
        } );
    }

    private onWorkLogRecurrenceUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.workLogRecurrencesSuccess, this, () => {
            this.messageService.success( WorkLogRecurrenceSuccessMessage.Updated );
            this.closeWorkLogRecurrenceUpdateFormModal();
        } );
    }

    private onWorkLogRecurrenceDeleteSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.workLogRecurrencesSuccess, this, () => {
            this.messageService.success( WorkLogRecurrenceSuccessMessage.Deleted );
            this.closeWorkLogRecurrenceUpdateFormModal();
        } );
    }

    private onWorkLogRecurrenceStatusToggleSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.workLogRecurrencesSuccess, this, () => {
            this.messageService.success( WorkLogRecurrenceSuccessMessage.StatusUpdated );
        } );
    }

    private handleAutoOpenWorkLogCreateFormModal(): void {
        this.dataService.source!.openWorkLogCreateFormModal
                                .pipe( takeUntilDestroy( this ) )
                                .subscribe( open => {
                                    if( open ) {
                                        this.openWorkLogCreateFormModal();
                                    }
                                } );
    }
}
