import { Injectable } from '@angular/core';
import { ClientActions } from '@clients/data/client.actions';
import { ClientSelectors } from '@clients/data/client.selectors';
import { ClientDto } from '@dtos/client-dto';
import { CsvWorkLogDto } from '@dtos/csv-work-log-dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { HolidayDto } from '@dtos/holiday-dto';
import { PaginatedResultDto } from '@dtos/paginated-result-dto';
import { ProjectDto } from '@dtos/project-dto';
import { UserDto } from '@dtos/user-dto';
import { VacationDto } from '@dtos/vacation-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { ListComponentDataService } from '@shared/data/list-component-data.service';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';
import { HolidayActions } from '@vacations/data/holiday.actions';
import { HolidaySelectors } from '@vacations/data/holiday.selectors';
import { VacationActions } from '@vacations/data/vacation.actions';
import { VacationSelectors } from '@vacations/data/vacation.selectors';
import { WorkLogActions } from '@work-logs/data/work-log.actions';
import { WorkLogSelectors } from '@work-logs/data/work-log.selectors';
import { takeUntilDestroy } from 'ngx-reactivetoolkit';
import { filter, Observable } from 'rxjs';

interface WorkLogListComponentData {
    pagination: PaginatedResultDto | null;
    csvWorkLogs: CsvWorkLogDto[];
    users: UserDto[];
    projects: ProjectDto[];
    clients: ClientDto[];
    vacations: VacationDto[];
    vacationsLoading: boolean;
    holidays: HolidayDto[];
    holidaysLoading: boolean;
}

@Injectable()
export class WorkLogListDataService extends ListComponentDataService<WorkLogDto, WorkLogListComponentData> {
    constructor(
        private readonly workLogActions: WorkLogActions,
        private readonly workLogSelectors: WorkLogSelectors,
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors,
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors,
        private readonly clientActions: ClientActions,
        private readonly clientSelectors: ClientSelectors,
        private readonly vacationActions: VacationActions,
        private readonly vacationSelectors: VacationSelectors,
        private readonly holidayActions: HolidayActions,
        private readonly holidaySelectors: HolidaySelectors
    ) {
        super( workLogSelectors );
    }

    get csvWorkLogsSafe(): Observable<CsvWorkLogDto[]> {
        return this.source!.csvWorkLogs.pipe( takeUntilDestroy( this.componentInstance ), filter( valueIsNotEmpty ) );
    }

    loadWorkLogs(params?: GetPaginatedWorkLogsParamsDto): void {
        this.workLogActions.loadPaginatedWorkLogs( params );
    }

    loadCsvWorkLogs(params?: GetPaginatedWorkLogsParamsDto): void {
        this.workLogActions.loadAllCsvWorkLogs( params );
    }

    loadProjects(): void {
        this.projectActions.loadAllProjects();
    }

    loadUsers(): void {
        this.userActions.loadAllUsers();
    }

    loadClients(): void {
        this.clientActions.loadAllClients();
    }

    loadVacations(): void {
        this.vacationActions.loadAllVacations();
    }

    loadHolidays(): void {
        this.holidayActions.loadAllHolidays();
    }

    importWorkLogsFromFile(file: File): void {
        this.workLogActions.importWorkLogsFromFile( file );
    }

    protected override onInit(): void {
    }

    protected override dataSource(): ComponentDataSource<WorkLogListComponentData> {
        return {
            pagination      : this.workLogSelectors.selectPagination(),
            csvWorkLogs     : this.workLogSelectors.selectCsvWorkLogs(),
            users           : this.userSelectors.selectAll(),
            projects        : this.projectSelectors.selectAll(),
            clients         : this.clientSelectors.selectAll(),
            vacations       : this.vacationSelectors.selectAll(),
            vacationsLoading: this.vacationSelectors.selectLoading(),
            holidays        : this.holidaySelectors.selectAll(),
            holidaysLoading : this.holidaySelectors.selectLoading()
        };
    }
}
