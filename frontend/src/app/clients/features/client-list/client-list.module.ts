import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ClientListRoutingModule } from '@clients/features/client-list/client-list-routing.module';
import { ClientListComponent } from '@clients/features/client-list/client-list.component';
import { ClientListTableComponent } from '@clients/ui/client-list-table.component';
import { ButtonModule } from '@shared/ui/button/button.module';
import { CreateButtonComponent } from '@shared/ui/button/create-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';

@NgModule( {
               imports     : [
                   CommonModule,
                   ClientListRoutingModule,
                   ClientListTableComponent,
                   ClientDataModule,
                   HeaderComponent,
                   TitleComponent,
                   ContainerComponent,
                   CreateButtonComponent,
                   ButtonModule
               ],
               declarations: [ ClientListComponent ]
           } )
export class ClientListModule {
}
