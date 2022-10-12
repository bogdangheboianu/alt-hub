import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { AppR } from '@shared/constants/routes';
import { UserListPageComponent } from '@user/pages/user-list-page/user-list-page.component';
import { UserPageComponent } from '@user/pages/user-page/user-page.component';

const routes: Routes = [
    {
        path     : '',
        component: UserListPageComponent,
        canActivate : [ IsAdminGuard ]
    },
    {
        path     : AppR.user.details.simple,
        component: UserPageComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class UserRoutingModule {

}
