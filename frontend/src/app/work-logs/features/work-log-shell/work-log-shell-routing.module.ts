import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () => import('@work-logs/features/work-log-list/work-log-list.module').then( m => m.WorkLogListModule )
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class WorkLogShellRoutingModule {
}
