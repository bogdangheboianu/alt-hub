import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyDetailsComponent } from '@company/features/company-details/company-details.component';

const routes: Routes = [
    {
        path     : '',
        component: CompanyDetailsComponent
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class CompanyDetailsRoutingModule {
}
