import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@config/guards/is-admin.guard';
import { AppR } from '@shared/config/constants/routes';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () => import('@projects/features/project-list/project-list.module').then( m => m.ProjectListModule )
    },
    {
        path        : AppR.project.create.simple,
        loadChildren: () => import('@projects/features/project-create/project-create.module').then( m => m.ProjectCreateModule ),
        canActivate : [ IsAdminGuard ]
    },
    {
        path        : AppR.project.details.simple,
        loadChildren: () => import('@projects/features/project-details/project-details.module').then( m => m.ProjectDetailsModule )
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ProjectShellRoutingModule {
}
