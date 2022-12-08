import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ClientCreateRoutingModule } from '@clients/features/client-create/client-create-routing.module';
import { ClientCreateComponent } from '@clients/features/client-create/client-create.component';
import { ClientCreateFormComponent } from '@clients/ui/client-create-form.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';

@NgModule( {
               imports     : [
                   CommonModule,
                   ClientCreateRoutingModule,
                   ClientCreateFormComponent,
                   ContainerComponent,
                   TitleComponent,
                   ClientDataModule,
                   HeaderComponent
               ],
               declarations: [ ClientCreateComponent ]
           } )
export class ClientCreateModule {
}
