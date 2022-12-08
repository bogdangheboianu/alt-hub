import { Injectable } from '@angular/core';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { PaginatedResultDto } from '@dtos/paginated-result-dto';
import { PaginationParamsDto } from '@dtos/pagination-params-dto';
import { ProjectDto } from '@dtos/project-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { WorkLogActions } from '@work-logs/data/work-log.actions';
import { WorkLogSelectors } from '@work-logs/data/work-log.selectors';

export interface ProjectWorkLogsComponentData {
    workLogs: WorkLogDto[];
    workLogsPagination: PaginatedResultDto | null;
    workLogsLoading: boolean;
}

@Injectable()
export class ProjectWorkLogsDataService extends DetailsComponentDataService<ProjectDto, ProjectWorkLogsComponentData> {
    projectWorkLogsParams: GetPaginatedWorkLogsParamsDto = {};

    constructor(
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors,
        private readonly workLogActions: WorkLogActions,
        private readonly workLogSelectors: WorkLogSelectors
    ) {
        super( projectSelectors );
    }

    loadProjectWorkLogs(paginationParams: PaginationParamsDto = {}): void {
        this.projectWorkLogsParams = { ...this.projectWorkLogsParams, ...paginationParams };
        this.entity$.subscribe( project => this.workLogActions.loadPaginatedWorkLogs( {
                                                                                          projectId: project.id,
                                                                                          ...this.projectWorkLogsParams
                                                                                      } ) );
    }

    protected override onInit(): void {
        this.loadProjectWorkLogs();
    }

    protected override dataSource(): ComponentDataSource<ProjectWorkLogsComponentData> {
        return {
            workLogs          : this.workLogSelectors.selectAll(),
            workLogsPagination: this.workLogSelectors.selectPagination(),
            workLogsLoading   : this.workLogSelectors.selectLoading()
        };
    }
}
