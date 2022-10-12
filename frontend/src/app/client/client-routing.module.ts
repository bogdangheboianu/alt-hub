import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListPageComponent } from '@client/pages/client-list-page/client-list-page.component';
import { ClientPageComponent } from '@client/pages/client-page/client-page.component';
import { AppR } from '@shared/constants/routes';

const routes: Routes = [
    {
        path     : '',
        component: ClientListPageComponent
    },
    {
        path     : AppR.client.details.simple,
        component: ClientPageComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ClientRoutingModule {
}
