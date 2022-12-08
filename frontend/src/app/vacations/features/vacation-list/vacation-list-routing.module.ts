import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacationListComponent } from '@vacations/features/vacation-list/vacation-list.component';

const routes: Routes = [
    {
        path     : '',
        component: VacationListComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class VacationListRoutingModule {
}
