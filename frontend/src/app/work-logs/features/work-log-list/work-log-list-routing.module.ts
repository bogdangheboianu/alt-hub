import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkLogListComponent } from '@work-logs/features/work-log-list/work-log-list.component';

const routes: Routes = [
    {
        path     : '',
        component: WorkLogListComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class WorkLogListRoutingModule {
}
