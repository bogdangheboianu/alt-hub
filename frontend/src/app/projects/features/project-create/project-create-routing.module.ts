import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectCreateComponent } from '@projects/features/project-create/project-create.component';

const routes: Routes = [
    {
        path     : '',
        component: ProjectCreateComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ProjectCreateRoutingModule {
}
