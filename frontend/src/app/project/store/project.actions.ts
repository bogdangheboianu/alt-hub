import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { AssignCoordinatorToProjectDto } from '@dtos/assign-coordinator-to-project.dto';
import { AssignUsersToProjectDto } from '@dtos/assign-users-to-project.dto';
import { CreateProjectDto } from '@dtos/create-project.dto';
import { GetAllProjectsParamsDto } from '@dtos/get-all-projects-params.dto';
import { UpdateProjectTimelineDto } from '@dtos/update-project-timeline.dto';
import { ProjectService } from '@project/services/project.service';
import { ProjectSelectors } from '@project/store/project.selectors';
import { ProjectStore } from '@project/store/project.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectActions {
    constructor(
        private projectService: ProjectService,
        private projectSelectors: ProjectSelectors,
        private projectStore: ProjectStore
    ) {
    }

    @action( 'Load all projects' )
    loadAllProjects(params?: GetAllProjectsParamsDto): void {
        firstValueFrom( this.projectService.getAllProjects( params ) )
            .then();
    }

    @action( 'Load project by id' )
    loadProjectById(id: string): void {
        if( this.projectSelectors.hasEntity( id ) ) {
            return this.projectStore.setActive( id );
        }

        firstValueFrom( this.projectService.getProjectById( id ) )
            .then();
    }

    @action( 'Create project' )
    createProject(data: CreateProjectDto): void {
        firstValueFrom( this.projectService.createProject( data ) )
            .then();
    }

    @action( 'Update project timeline' )
    updateProjectTimeline(projectId: string, data: UpdateProjectTimelineDto): void {
        firstValueFrom( this.projectService.updateProjectTimeline( projectId, data ) )
            .then();
    }

    @action( 'Assign users to project' )
    assignUsersToProject(projectId: string, data: AssignUsersToProjectDto): void {
        firstValueFrom( this.projectService.assignUsersToProject( projectId, data ) )
            .then();
    }

    @action( 'Assign coordinator to project' )
    assignCoordinatorToProject(projectId: string, data: AssignCoordinatorToProjectDto): void {
        firstValueFrom( this.projectService.assignCoordinatorToProject( projectId, data ) )
            .then();
    }
}
