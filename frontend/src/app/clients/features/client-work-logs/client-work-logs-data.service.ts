import { Injectable } from '@angular/core';
import { ClientSelectors } from '@clients/data/client.selectors';
import { ClientDto } from '@dtos/client-dto';
import { CsvWorkLogDto } from '@dtos/csv-work-log-dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { PaginatedResultDto } from '@dtos/paginated-result-dto';
import { ProjectDto } from '@dtos/project-dto';
import { UserDto } from '@dtos/user-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { takeIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';
import { WorkLogActions } from '@work-logs/data/work-log.actions';
import { WorkLogSelectors } from '@work-logs/data/work-log.selectors';

export interface ClientWorkLogsComponentData {
    workLogs: WorkLogDto[];
    workLogsLoading: boolean;
    workLogsPagination: PaginatedResultDto;
    csvWorkLogs: CsvWorkLogDto[];
    projects: ProjectDto[];
    projectsLoading: boolean;
    users: UserDto[];
    usersLoading: boolean;
}

@Injectable()
export class ClientWorkLogsDataService extends DetailsComponentDataService<ClientDto, ClientWorkLogsComponentData> {
    constructor(
        private readonly clientSelectors: ClientSelectors,
        private readonly workLogActions: WorkLogActions,
        private readonly workLogSelectors: WorkLogSelectors,
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors,
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors
    ) {
        super( clientSelectors );
    }

    loadWorkLogs(params?: GetPaginatedWorkLogsParamsDto): void {
        this.entity$.subscribe( client => this.workLogActions.loadPaginatedWorkLogs( { ...params, clientId: client.id } ) );
    }

    loadCsvWorkLogs(params?: GetPaginatedWorkLogsParamsDto): void {
        this.entity.then( client => this.workLogActions.loadAllCsvWorkLogs( { ...params, clientId: client.id } ) );
    }

    loadClientProjects(): void {
        this.entity.then( client => this.projectActions.loadAllProjects( { clientId: client.id } ) );
    }

    loadUsers(): void {
        this.userActions.loadAllUsers();
    }

    protected override onInit(): void {
        this.loadWorkLogs();
    }

    protected override dataSource(): ComponentDataSource<ClientWorkLogsComponentData> {
        return {
            workLogs          : this.workLogSelectors.selectAll(),
            workLogsLoading   : this.workLogSelectors.selectLoading(),
            workLogsPagination: this.workLogSelectors.selectPagination()
                                    .pipe( takeIfDefined ),
            csvWorkLogs       : this.workLogSelectors.selectCsvWorkLogs(),
            projects          : this.projectSelectors.selectAll(),
            projectsLoading   : this.projectSelectors.selectLoading(),
            users             : this.userSelectors.selectAll(),
            usersLoading      : this.userSelectors.selectLoading()
        };
    }
}
