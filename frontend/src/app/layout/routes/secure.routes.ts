import { Routes } from '@angular/router';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { AppR } from '@shared/constants/routes';

export const SECURE_ROUTES: Routes = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: AppR.dashboard.simple
    },
    {
        path        : AppR.dashboard.simple,
        loadChildren: () => import('@dashboard/dashboard.module').then( m => m.DashboardModule )
    },
    {
        path        : AppR.user.list.simple,
        loadChildren: () => import('@user/user.module').then( m => m.UserModule ),
    },
    {
        path        : AppR.client.list.simple,
        loadChildren: () => import('@client/client.module').then( m => m.ClientModule ),
        canActivate : [ IsAdminGuard ]
    },
    {
        path        : AppR.project.list.simple,
        loadChildren: () => import('@project/project.module').then( m => m.ProjectModule )
    },
    {
        path        : AppR.company.simple,
        loadChildren: () => import('@company/company.module').then( m => m.CompanyModule ),
        canActivate : [ IsAdminGuard ]
    },
    {
        path        : AppR.workLog.list.simple,
        loadChildren: () => import('@work-log/work-log.module').then( m => m.WorkLogModule ),
        canActivate : [ IsAdminGuard ]
    }
];
