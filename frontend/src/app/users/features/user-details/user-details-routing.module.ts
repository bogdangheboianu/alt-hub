import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from '@users/features/user-details/user-details.component';

const routes: Routes = [
    {
        path     : '',
        component: UserDetailsComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class UserDetailsRoutingModule {
}
