import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProjectDto } from '@dtos/create-project-dto';
import { CreateProjectMemberDto } from '@dtos/create-project-member-dto';
import { DeletedEntityResponseDto } from '@dtos/deleted-entity-response-dto';
import { GetAllProjectsParamsDto } from '@dtos/get-all-projects-params-dto';
import { ProjectDto } from '@dtos/project-dto';
import { UpdateProjectInfoDto } from '@dtos/update-project-info-dto';
import { UpdateProjectMemberDto } from '@dtos/update-project-member-dto';
import { UpdateProjectPricingDto } from '@dtos/update-project-pricing-dto';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline-dto';
import { ProjectStore } from '@projects/data/project.store';
import { ApiResult } from '@shared/api/api-result';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiService } from '@shared/api/api.service';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectApiService extends ApiService {
    constructor(private projectStore: ProjectStore) {
        super( projectStore );
    }

    getAllProjects(params?: GetAllProjectsParamsDto): Observable<ApiResult<ProjectDto[]>> {
        let queryParams = new HttpParams();

        if( valueIsNotEmpty( params?.statusGroup ) ) {
            queryParams = queryParams.append( 'statusGroup', params!.statusGroup! );
        }

        if( valueIsNotEmpty( params?.clientId ) ) {
            queryParams = queryParams.append( 'clientId', params!.clientId );
        }

        return this.getWithParams( apiRoutes.projects.base, queryParams, this.projectStore.onProjectListLoaded.bind( this.projectStore ) );
    }

    getProjectById(id: string): Observable<ApiResult<ProjectDto>> {
        return this.get( `${ apiRoutes.projects.base }/${ id }`, this.projectStore.onProjectLoaded.bind( this.projectStore ) );
    }

    createProject(data: CreateProjectDto): Observable<ApiResult<ProjectDto>> {
        return this.post( apiRoutes.projects.base, data, this.projectStore.onProjectCreated.bind( this.projectStore ) );
    }

    updateProjectInfo(projectId: string, data: UpdateProjectInfoDto): Observable<ApiResult<ProjectDto>> {
        return this.patch( `${ apiRoutes.projects.base }/${ projectId }/info`, data, this.projectStore.onProjectInfoUpdated.bind( this.projectStore ) );
    }

    updateProjectTimeline(projectId: string, data: UpdateProjectTimelineDto): Observable<ApiResult<ProjectDto>> {
        return this.patch( `${ apiRoutes.projects.base }/${ projectId }/timeline`, data, this.projectStore.onProjectTimelineUpdated.bind( this.projectStore ) );
    }

    updateProjectPricing(projectId: string, data: UpdateProjectPricingDto): Observable<ApiResult<ProjectDto>> {
        return this.patch( `${ apiRoutes.projects.base }/${ projectId }/pricing`, data, this.projectStore.onProjectPricingUpdated.bind( this.projectStore ) );
    }

    createProjectMember(projectId: string, data: CreateProjectMemberDto): Observable<ApiResult<ProjectDto>> {
        return this.post( `${ apiRoutes.projects.base }/${ projectId }/members`, data, this.projectStore.onProjectMemberCreated.bind( this.projectStore ) );
    }

    updateProjectMember(projectId: string, data: UpdateProjectMemberDto, memberId: string): Observable<ApiResult<ProjectDto>> {
        return this.patch( `${ apiRoutes.projects.base }/${ projectId }/members/${ memberId }`, data, this.projectStore.onProjectMemberUpdated.bind( this.projectStore ) );
    }

    deleteProjectMember(projectId: string, memberId: string): Observable<ApiResult<ProjectDto>> {
        return this.delete( `${ apiRoutes.projects.base }/${ projectId }/members/${ memberId }`, this.projectStore.onProjectMemberDeleted.bind( this.projectStore ) );
    }

    deleteProject(projectId: string): Observable<ApiResult<DeletedEntityResponseDto>> {
        return this.delete( `${ apiRoutes.projects.base }/${ projectId }`, this.projectStore.onProjectDeleted.bind( this.projectStore ) );
    }
}
