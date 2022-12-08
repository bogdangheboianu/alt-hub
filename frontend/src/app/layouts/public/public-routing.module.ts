import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from '@layouts/public/public.component';

const routes: Routes = [
    {
        path     : '',
        component: PublicComponent,
        children : [
            {
                path        : '',
                loadChildren: () => import('@auth/features/auth-shell/auth-shell.module').then( m => m.AuthShellModule )
            }
        ]
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class PublicRoutingModule {
}
