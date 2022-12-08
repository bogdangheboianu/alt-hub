import { NgModule } from '@angular/core';
import { ProjectClientNamePipe } from '@projects/pipes/project-client-name.pipe';
import { ProjectClientPipe } from '@projects/pipes/project-client.pipe';
import { ProjectCoordinatorFullNamePipe } from '@projects/pipes/project-coordinator-full-name.pipe';
import { ProjectCoordinatorPipe } from '@projects/pipes/project-coordinator.pipe';
import { ProjectFormattedStatusPipe } from '@projects/pipes/project-formatted-status.pipe';
import { ProjectNamePipe } from '@projects/pipes/project-name.pipe';
import { ProjectStatusPipe } from '@projects/pipes/project-status.pipe';

const Pipes = [
    ProjectClientNamePipe,
    ProjectCoordinatorPipe,
    ProjectNamePipe,
    ProjectFormattedStatusPipe,
    ProjectStatusPipe,
    ProjectClientPipe,
    ProjectCoordinatorFullNamePipe
];

@NgModule( {
               declarations: Pipes,
               exports     : Pipes
           } )
export class ProjectPipesModule {
}
