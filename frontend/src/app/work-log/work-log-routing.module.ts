import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkLogListPageComponent } from '@work-log/pages/work-log-list-page/work-log-list-page.component';

const routes: Routes = [
    {
        path     : '',
        component: WorkLogListPageComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class WorkLogRoutingModule {
}
