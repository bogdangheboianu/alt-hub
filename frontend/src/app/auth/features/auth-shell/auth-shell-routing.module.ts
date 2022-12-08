import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthGuard } from '@config/guards/not-auth.guard';
import { AppR } from '@shared/config/constants/routes';

const routes: Routes = [
    {
        path      : '',
        redirectTo: AppR.auth.login.full,
        pathMatch : 'full'
    },
    {
        path        : AppR.auth.login.simple,
        loadChildren: () => import('@auth/features/login/login.module').then( m => m.LoginModule ),
        canActivate : [ NotAuthGuard ]
    },
    {
        path        : AppR.auth.setPassword.simple,
        loadChildren: () => import('@auth/features/set-password/set-password.module').then( m => m.SetPasswordModule ),
        canActivate : [ NotAuthGuard ]
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class AuthShellRoutingModule {
}
