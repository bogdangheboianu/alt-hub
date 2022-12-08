import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { CreateProjectDto } from '@dtos/create-project-dto';
import { CreateProjectMemberDto } from '@dtos/create-project-member-dto';
import { GetAllProjectsParamsDto } from '@dtos/get-all-projects-params-dto';
import { UpdateProjectInfoDto } from '@dtos/update-project-info-dto';
import { UpdateProjectMemberDto } from '@dtos/update-project-member-dto';
import { UpdateProjectPricingDto } from '@dtos/update-project-pricing-dto';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline-dto';
import { ProjectApiService } from '@projects/data/project-api.service';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { ProjectStore } from '@projects/data/project.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectActions {
    constructor(
        private projectApiService: ProjectApiService,
        private projectSelectors: ProjectSelectors,
        private projectStore: ProjectStore
    ) {
    }

    @action( 'Load all projects' )
    loadAllProjects(params?: GetAllProjectsParamsDto): void {
        firstValueFrom( this.projectApiService.getAllProjects( params ) )
            .then();
    }

    @action( 'Load project by id' )
    loadProjectById(id: string): void {
        if( this.projectSelectors.hasEntity( id ) ) {
            return this.projectStore.setActive( id );
        }

        firstValueFrom( this.projectApiService.getProjectById( id ) )
            .then();
    }

    @action( 'Create project' )
    createProject(data: CreateProjectDto): void {
        firstValueFrom( this.projectApiService.createProject( data ) )
            .then();
    }

    @action( 'Update project info' )
    updateProjectInfo(projectId: string, data: UpdateProjectInfoDto): void {
        firstValueFrom( this.projectApiService.updateProjectInfo( projectId, data ) )
            .then();
    }

    @action( 'Update project timeline' )
    updateProjectTimeline(projectId: string, data: UpdateProjectTimelineDto): void {
        firstValueFrom( this.projectApiService.updateProjectTimeline( projectId, data ) )
            .then();
    }

    @action( 'Update project pricing' )
    updateProjectPricing(projectId: string, data: UpdateProjectPricingDto): void {
        firstValueFrom( this.projectApiService.updateProjectPricing( projectId, data ) )
            .then();
    }

    @action( 'Create project member' )
    createProjectMember(projectId: string, data: CreateProjectMemberDto): void {
        firstValueFrom( this.projectApiService.createProjectMember( projectId, data ) )
            .then();
    }

    @action( 'Update project member' )
    updateProjectMember(projectId: string, memberId: string, data: UpdateProjectMemberDto): void {
        firstValueFrom( this.projectApiService.updateProjectMember( projectId, data, memberId ) )
            .then();
    }

    @action( 'Delete project member' )
    deleteProjectMember(projectId: string, memberId: string): void {
        firstValueFrom( this.projectApiService.deleteProjectMember( projectId, memberId ) )
            .then();
    }

    @action( 'Delete project' )
    deleteProject(projectId: string): void {
        firstValueFrom( this.projectApiService.deleteProject( projectId ) )
            .then();
    }
}
