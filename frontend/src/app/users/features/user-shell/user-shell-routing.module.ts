import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@config/guards/is-admin.guard';
import { AppR } from '@shared/config/constants/routes';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () => import('@users/features/user-list/user-list.module').then( m => m.UserListModule ),
        canActivate : [ IsAdminGuard ]
    },
    {
        path        : AppR.user.create.simple,
        loadChildren: () => import('@users/features/user-create/user-create.module').then( m => m.UserCreateModule ),
        canActivate : [ IsAdminGuard ]
    },
    {
        path        : AppR.user.details.simple,
        loadChildren: () => import('@users/features/user-details/user-details.module').then( m => m.UserDetailsModule )
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class UserShellRoutingModule {
}
