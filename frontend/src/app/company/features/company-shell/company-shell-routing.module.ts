import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () => import('@company/features/company-details/company-details.module').then( m => m.CompanyDetailsModule )
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class CompanyShellRoutingModule {
}
