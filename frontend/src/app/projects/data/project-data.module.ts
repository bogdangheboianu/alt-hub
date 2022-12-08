import { NgModule } from '@angular/core';
import { ProjectApiService } from '@projects/data/project-api.service';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { ProjectStore } from '@projects/data/project.store';

@NgModule( {
               providers: [
                   ProjectApiService,
                   ProjectStore,
                   ProjectSelectors,
                   ProjectActions
               ]
           } )
export class ProjectDataModule {
}
