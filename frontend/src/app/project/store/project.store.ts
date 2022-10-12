import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { CreateProjectInfoDto } from '@dtos/create-project-info.dto';
import { CreateProjectTimelineDto } from '@dtos/create-project-timeline.dto';
import { ProjectDto } from '@dtos/project.dto';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';
import { BaseEntityStore } from '@shared/store/base-entity-store';
import { initialBaseEntityState } from '@shared/store/initial-base-entity-state.function';
import { storeEvent } from '@shared/store/store-event.decorator';

export interface ProjectState extends IBaseEntityState<ProjectDto> {
    newProject: {
        id: string | null;
        info: CreateProjectInfoDto | null;
        timeline: CreateProjectTimelineDto | null;
    };
}

const createInitialState = (): ProjectState => (
    {
        ...initialBaseEntityState(),
        newProject: {
            id      : null,
            info    : null,
            timeline: null
        }
    }
);

@Injectable()
@StoreConfig( { name: 'projects' } )
export class ProjectStore extends BaseEntityStore<ProjectDto, ProjectState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'Project list loaded' )
    onProjectListLoaded(projectList: ProjectDto[]): void {
        this.set( projectList );
    }

    @storeEvent( 'Project loaded' )
    onProjectLoaded(project: ProjectDto): void {
        this.upsert( project.id, project );
        this.setActive( project.id );
    }

    @storeEvent( 'Project created' )
    onProjectCreated(project: ProjectDto): void {
        this.add( project );
        this.update( state => (
            { ...state, newProject: { ...state.newProject, id: project.id } }
        ) );
    }

    @storeEvent( 'Project timeline updated' )
    onProjectTimelineUpdated(project: ProjectDto): void {
        this.replace( project.id, project );
        this.setActive( project.id );
    }

    @storeEvent( 'Users assigned to project' )
    onUsersAssignedToProject(project: ProjectDto): void {
        this.upsert( project.id, project );
        this.setActive( project.id );
    }

    @storeEvent( 'Coordinator assigned to project' )
    onCoordinatorAssignedToProject(project: ProjectDto): void {
        this.upsert( project.id, project );
        this.setActive( project.id );
    }

    setNewProjectInfo(info: CreateProjectInfoDto): void {
        this.update( state => (
            {
                ...state,
                newProject: { ...state.newProject, info }
            }
        ) );
    }

    setNewProjectTimeline(timeline: CreateProjectTimelineDto): void {
        this.update( state => (
            {
                ...state,
                newProject: { ...state.newProject, timeline }
            }
        ) );
    }

    resetNewProject(): void {
        this.update( state => (
            {
                ...state,
                newProject: { ...createInitialState().newProject }
            }
        ) );
    }
}
