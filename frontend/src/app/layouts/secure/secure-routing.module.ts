import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@config/guards/is-admin.guard';
import { SecureComponent } from '@layouts/secure/secure.component';
import { AppR } from '@shared/config/constants/routes';

export const SECURE_ROUTES: Routes = [
    {
        path        : AppR.dashboard.simple,
        loadChildren: () => import('@dashboard/dashboard.module').then( m => m.DashboardModule )
    },
    {
        path        : AppR.company.simple,
        loadChildren: () => import('@company/features/company-shell/company-shell.module').then( m => m.CompanyShellModule ),
        canActivate : [ IsAdminGuard ]
    },
    {
        path        : AppR.user.list.simple,
        loadChildren: () => import('@users/features/user-shell/user-shell.module').then( m => m.UserShellModule )
    },
    {
        path        : AppR.project.list.simple,
        loadChildren: () => import('@projects/features/project-shell/project-shell.module').then( m => m.ProjectShellModule )
    },
    {
        path        : AppR.client.list.simple,
        loadChildren: () => import('@clients/features/client-shell/client-shell.module').then( m => m.ClientShellModule ),
        canActivate : [ IsAdminGuard ]
    },
    {
        path        : AppR.workLog.list.simple,
        loadChildren: () => import('@work-logs/features/work-log-shell/work-log-shell.module').then( m => m.WorkLogShellModule ),
        canActivate : [ IsAdminGuard ]
    },
    {
        path        : AppR.vacation.list.simple,
        loadChildren: () => import('@vacations/features/vacation-shell/vacation-shell.module').then( m => m.VacationShellModule ),
        canActivate : [ IsAdminGuard ]
    }
];

const routes: Routes = [
    {
        path     : '',
        component: SecureComponent,
        children : SECURE_ROUTES
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class SecureRoutingModule {
}
