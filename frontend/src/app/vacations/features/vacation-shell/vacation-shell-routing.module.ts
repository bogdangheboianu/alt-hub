import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () => import('@vacations/features/vacation-list/vacation-list.module').then( m => m.VacationListModule )
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class VacationShellRoutingModule {
}
