import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientModule } from '@client/client.module';
import { CompanyRoutingModule } from '@company/company-routing.module';
import { CompanyPageComponent } from '@company/pages/company-page/company-page.component';
import { CompanyService } from '@company/services/company.service';
import { CompanyActions } from '@company/store/company.actions';
import { CompanySelectors } from '@company/store/company.selectors';
import { CompanyStore } from '@company/store/company.store';
import { SharedModule } from '@shared/shared.module';
import { CompanyClientsTabComponent } from './components/company-clients-tab/company-clients-tab.component';

@NgModule( {
               declarations: [
                   CompanyPageComponent,
                   CompanyClientsTabComponent
               ],
               imports: [
                   CommonModule,
                   CompanyRoutingModule,
                   SharedModule,
                   MatTabsModule,
                   ClientModule
               ],
               providers   : [
                   CompanyService,
                   CompanyActions,
                   CompanyStore,
                   CompanySelectors
               ]
           } )
export class CompanyModule {
}
