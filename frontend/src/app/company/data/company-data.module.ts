import { NgModule } from '@angular/core';
import { CompanyApiService } from '@company/data/company-api.service';
import { CompanyActions } from '@company/data/company.actions';
import { CompanySelectors } from '@company/data/company.selectors';
import { CompanyStore } from '@company/data/company.store';

@NgModule( {
               providers: [
                   CompanyStore,
                   CompanyActions,
                   CompanySelectors,
                   CompanyApiService
               ]
           } )
export class CompanyDataModule {
}
