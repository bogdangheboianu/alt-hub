import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from '@projects/features/project-list/project-list.component';

const routes: Routes = [
    {
        path     : '',
        component: ProjectListComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ProjectListRoutingModule {
}
