import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppR } from '@shared/constants/routes';
import { ProjectListPageComponent } from '@project/pages/project-list-page/project-list-page.component';
import { ProjectPageComponent } from '@project/pages/project-page/project-page.component';

const routes: Routes = [
    {
        path     : '',
        component: ProjectListPageComponent
    },
    {
        path     : AppR.project.details.simple,
        component: ProjectPageComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ProjectRoutingModule {
}
