import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetPasswordComponent } from '@auth/features/set-password/set-password.component';

const routes: Routes = [
    {
        path     : '',
        component: SetPasswordComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class SetPasswordRoutingModule {
}
