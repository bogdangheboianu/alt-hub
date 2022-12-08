import { Injectable } from '@angular/core';
import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence-dto';
import { CreateWorkLogsDto } from '@dtos/create-work-logs-dto';
import { CsvWorkLogDto } from '@dtos/csv-work-log-dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { PaginatedResultDto } from '@dtos/paginated-result-dto';
import { ProjectDto } from '@dtos/project-dto';
import { ProjectStatusGroupEnum } from '@dtos/project-status-group-enum';
import { UpdateWorkLogDto } from '@dtos/update-work-log-dto';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence-dto';
import { UserDto } from '@dtos/user-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { takeIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';
import { WorkLogRecurrenceActions } from '@work-logs/data/work-log-recurrence.actions';
import { WorkLogRecurrenceSelectors } from '@work-logs/data/work-log-recurrence.selectors';
import { WorkLogActions } from '@work-logs/data/work-log.actions';
import { WorkLogSelectors } from '@work-logs/data/work-log.selectors';
import { WorkLogRecurrenceToggleStatusEvent } from '@work-logs/ui/work-log-recurrence-list-table.component';

interface UserWorkLogsComponentData {
    workLogs: WorkLogDto[];
    workLogsPagination: PaginatedResultDto;
    workLogsLoading: boolean;
    workLogsSuccess: boolean;
    workLogRecurrences: WorkLogRecurrenceDto[];
    workLogRecurrencesLoading: boolean;
    workLogRecurrencesSuccess: boolean;
    projects: ProjectDto[];
    projectOptions: SelectInputOptions;
    projectOptionsLoading: boolean;
    csvWorkLogs: CsvWorkLogDto[];
    openWorkLogCreateFormModal: boolean;
}

@Injectable()
export class UserWorkLogsDataService extends DetailsComponentDataService<UserDto, UserWorkLogsComponentData> {
    constructor(
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors,
        private readonly workLogActions: WorkLogActions,
        private readonly workLogSelectors: WorkLogSelectors,
        private readonly workLogRecurrenceActions: WorkLogRecurrenceActions,
        private readonly workLogRecurrenceSelectors: WorkLogRecurrenceSelectors,
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors
    ) {
        super( userSelectors );
    }

    loadWorkLogs(params?: GetPaginatedWorkLogsParamsDto): void {
        this.entity$.subscribe( user => this.workLogActions.loadPaginatedWorkLogs( { ...params, userId: user.id } ) );
    }

    loadWorkLogRecurrences(): void {
        this.workLogRecurrenceActions.loadAllUserWorkLogRecurrences();
    }

    loadProjects(): void {
        this.projectActions.loadAllProjects( { statusGroup: ProjectStatusGroupEnum.Active } );
    }

    createWorkLog(data: CreateWorkLogsDto): void {
        this.workLogActions.createWorkLogs( data );
    }

    createWorkLogRecurrence(data: CreateWorkLogRecurrenceDto): void {
        this.workLogRecurrenceActions.createWorkLogRecurrence( data );
    }

    updateWorkLog(id: string, data: UpdateWorkLogDto): void {
        this.workLogActions.updateWorkLog( id, data );
    }

    updateWorkLogRecurrence(id: string, data: UpdateWorkLogRecurrenceDto): void {
        this.workLogRecurrenceActions.updateWorkLogRecurrence( id, data );
    }

    deleteWorkLog(id: string): void {
        this.workLogActions.deleteWorkLog( id );
    }

    deleteWorkLogRecurrence(id: string): void {
        this.workLogRecurrenceActions.deleteWorkLogRecurrence( id );
    }

    toggleWorkLogRecurrenceStatus(event: WorkLogRecurrenceToggleStatusEvent): void {
        const { id, active } = event;
        active
        ? this.workLogRecurrenceActions.activateWorkLogRecurrence( id )
        : this.workLogRecurrenceActions.deactivateWorkLogRecurrence( id );
    }

    loadCsvWorkLogs(params?: GetPaginatedWorkLogsParamsDto): void {
        this.entity.then( user => this.workLogActions.loadAllCsvWorkLogs( { ...params, userId: user.id } ) );
    }

    protected override onInit(): void {
        this.loadWorkLogs();
    }

    protected override dataSource(): ComponentDataSource<UserWorkLogsComponentData> {
        return {
            workLogs                  : this.workLogSelectors.selectAll(),
            workLogsPagination        : this.workLogSelectors.selectPagination()
                                            .pipe( takeIfDefined ),
            csvWorkLogs               : this.workLogSelectors.selectCsvWorkLogs(),
            workLogsLoading           : this.workLogSelectors.selectLoading(),
            workLogsSuccess           : this.workLogSelectors.selectSuccess(),
            workLogRecurrences        : this.workLogRecurrenceSelectors.selectAll(),
            workLogRecurrencesLoading : this.workLogRecurrenceSelectors.selectLoading(),
            workLogRecurrencesSuccess : this.workLogRecurrenceSelectors.selectSuccess(),
            projects                  : this.projectSelectors.selectAll(),
            projectOptions            : this.projectSelectors.selectAllAsSelectInputOptions(),
            projectOptionsLoading     : this.projectSelectors.selectLoading(),
            openWorkLogCreateFormModal: this.workLogSelectors.selectOpenWorkLogCreateFormModal()
        };
    }
}
