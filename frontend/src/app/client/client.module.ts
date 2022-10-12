import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ClientRoutingModule } from '@client/client-routing.module';
import { ClientListPageComponent } from '@client/pages/client-list-page/client-list-page.component';
import { ClientsTableComponent } from '@client/components/clients-table/clients-table.component';
import { CreateClientFormComponent } from '@client/components/create-client-form/create-client-form.component';
import { UpdateClientFormComponent } from '@client/components/update-client-form/update-client-form.component';
import { ClientPageComponent } from '@client/pages/client-page/client-page.component';
import { ClientService } from '@client/services/client.service';
import { ClientActions } from '@client/store/client.actions';
import { ClientSelectors } from '@client/store/client.selectors';
import { ClientStore } from '@client/store/client.store';
import { SharedModule } from '@shared/shared.module';

@NgModule( {
               declarations: [
                   CreateClientFormComponent,
                   ClientListPageComponent,
                   ClientPageComponent,
                   ClientsTableComponent,
                   UpdateClientFormComponent
               ],
               imports     : [
                   CommonModule,
                   ClientRoutingModule,
                   SharedModule,
                   MatButtonModule,
                   MatCardModule,
                   ReactiveFormsModule,
                   MatFormFieldModule,
                   MatInputModule,
                   FlexModule,
                   MatTableModule,
                   MatProgressSpinnerModule
               ],
               exports     : [
                   ClientsTableComponent
               ],
               providers   : [
                   ClientService,
                   ClientStore,
                   ClientSelectors,
                   ClientActions
               ]
           } )
export class ClientModule {
}
