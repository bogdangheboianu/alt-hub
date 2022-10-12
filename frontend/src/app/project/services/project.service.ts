import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiRoutes } from '@shared/constants/api.routes';
import { ApiResult } from '@shared/models/api-result';
import { ApiService } from '@shared/services/api.service';
import { AssignCoordinatorToProjectDto } from '@dtos/assign-coordinator-to-project.dto';
import { AssignUsersToProjectDto } from '@dtos/assign-users-to-project.dto';
import { CreateProjectDto } from '@dtos/create-project.dto';
import { GetAllProjectsParamsDto } from '@dtos/get-all-projects-params.dto';
import { ProjectDto } from '@dtos/project.dto';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline.dto';
import { ProjectStore } from '@project/store/project.store';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectService extends ApiService {
    constructor(private projectStore: ProjectStore) {
        super( projectStore );
    }

    getAllProjects(params?: GetAllProjectsParamsDto): Observable<ApiResult<ProjectDto[]>> {
        let queryParams = new HttpParams();

        if( valueIsNotEmpty( params?.statusGroup ) ) {
            queryParams = queryParams.append( 'statusGroup', params!.statusGroup! );
        }
        return this.getWithParams( apiRoutes.projects, queryParams, this.projectStore.onProjectListLoaded.bind( this.projectStore ) );
    }

    getProjectById(id: string): Observable<ApiResult<ProjectDto>> {
        return this.get( `${ apiRoutes.projects }/${ id }`, this.projectStore.onProjectLoaded.bind( this.projectStore ) );
    }

    createProject(data: CreateProjectDto): Observable<ApiResult<ProjectDto>> {
        return this.post( apiRoutes.projects, data, this.projectStore.onProjectCreated.bind( this.projectStore ) );
    }

    updateProjectTimeline(projectId: string, data: UpdateProjectTimelineDto): Observable<ApiResult<ProjectDto>> {
        return this.patch( `${ apiRoutes.projects }/${ projectId }/timeline`, data, this.projectStore.onProjectTimelineUpdated.bind( this.projectStore ) );
    }

    assignUsersToProject(projectId: string, data: AssignUsersToProjectDto): Observable<ApiResult<ProjectDto>> {
        return this.patch( `${ apiRoutes.projects }/${ projectId }/users`, data, this.projectStore.onUsersAssignedToProject.bind( this.projectStore ) );
    }

    assignCoordinatorToProject(projectId: string, data: AssignCoordinatorToProjectDto): Observable<ApiResult<ProjectDto>> {
        return this.patch( `${ apiRoutes.projects }/${ projectId }/coordinator`, data, this.projectStore.onCoordinatorAssignedToProject.bind( this.projectStore ) );
    }
}
