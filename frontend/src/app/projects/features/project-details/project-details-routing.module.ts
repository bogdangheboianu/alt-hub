import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from '@projects/features/project-details/project-details.component';

const routes: Routes = [
    {
        path     : '',
        component: ProjectDetailsComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ProjectDetailsRoutingModule {
}
