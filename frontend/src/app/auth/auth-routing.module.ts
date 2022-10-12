import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthGuard } from '@auth/guards/not-auth.guard';
import { LoginPageComponent } from '@auth/pages/login-page/login-page.component';
import { AppR } from '@shared/constants/routes';

const routes: Routes = [
    {
        path       : AppR.auth.login.simple,
        component  : LoginPageComponent,
        canActivate: [ NotAuthGuard ]
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class AuthRoutingModule {
}
