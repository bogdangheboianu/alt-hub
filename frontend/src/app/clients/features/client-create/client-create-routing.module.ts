import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientCreateComponent } from '@clients/features/client-create/client-create.component';

const routes: Routes = [
    {
        path     : '',
        component: ClientCreateComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ClientCreateRoutingModule {
}
