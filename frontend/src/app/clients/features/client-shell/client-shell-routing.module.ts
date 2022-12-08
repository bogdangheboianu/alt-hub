import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () => import('@clients/features/client-list/client-list.module').then( m => m.ClientListModule )
    },
    {
        path        : AppR.client.create.simple,
        loadChildren: () => import('@clients/features/client-create/client-create.module').then( m => m.ClientCreateModule )
    },
    {
        path        : AppR.client.details.simple,
        loadChildren: () => import('@clients/features/client-details/client-details.module').then( m => m.ClientDetailsModule )
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ClientShellRoutingModule {
}
