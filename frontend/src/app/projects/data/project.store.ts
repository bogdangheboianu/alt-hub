import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { storeEvent } from '@config/store/store.decorators';
import { initialBaseEntityState } from '@config/store/store.functions';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { StoreConfig } from '@datorama/akita';
import { DeletedEntityResponseDto } from '@dtos/deleted-entity-response-dto';
import { ProjectDto } from '@dtos/project-dto';

export interface ProjectState extends IBaseEntityState<ProjectDto> {
}

const createInitialState = (): ProjectState => (
    {
        ...initialBaseEntityState()
    }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Projects } )
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
        this.setActive( project.id );
    }

    @storeEvent( 'Project timeline updated' )
    onProjectTimelineUpdated(project: ProjectDto): void {
        this.replace( project.id, project );
        this.setActive( project.id );
    }

    @storeEvent( 'Project pricing updated' )
    onProjectPricingUpdated(project: ProjectDto): void {
        this.replace( project.id, project );
        this.setActive( project.id );
    }

    @storeEvent( 'Project info updated' )
    onProjectInfoUpdated(project: ProjectDto): void {
        this.upsert( project.id, project );
        this.setActive( project.id );
    };

    @storeEvent( 'Project member created' )
    onProjectMemberCreated(project: ProjectDto): void {
        this.upsert( project.id, project );
        this.setActive( project.id );
    }

    @storeEvent( 'Project member updated' )
    onProjectMemberUpdated(project: ProjectDto): void {
        this.upsert( project.id, project );
        this.setActive( project.id );
    }

    @storeEvent( 'Project member deleted' )
    onProjectMemberDeleted(project: ProjectDto): void {
        this.upsert( project.id, project );
        this.setActive( project.id );
    }

    @storeEvent( 'Project deleted' )
    onProjectDeleted(data: DeletedEntityResponseDto): void {
        this.remove( data.deletedId );
    }
}
