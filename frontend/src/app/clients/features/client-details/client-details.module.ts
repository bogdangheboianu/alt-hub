import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IsAdminModule } from '@auth/directives/is-admin/is-admin.module';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ClientDetailsRoutingModule } from '@clients/features/client-details/client-details-routing.module';
import { ClientDetailsComponent } from '@clients/features/client-details/client-details.component';
import { ClientDetailsTabsComponent } from '@clients/ui/client-details-tabs.component';
import { ClientUpdateFormComponent } from '@clients/ui/client-update-form.component';
import { ModalModule } from '@shared/features/modal/modal.module';
import { DropdownMenuComponent } from '@shared/ui/dropdown-menu.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { TitleComponent } from '@shared/ui/title.component';

@NgModule( {
               imports     : [
                   CommonModule,
                   ClientDetailsRoutingModule,
                   ClientDataModule,
                   ClientUpdateFormComponent,
                   HeaderComponent,
                   TitleComponent,
                   IsAdminModule,
                   DropdownMenuComponent,
                   LoadingBarComponent,
                   ModalModule,
                   ClientDetailsTabsComponent
               ],
               declarations: [ ClientDetailsComponent ]
           } )
export class ClientDetailsModule {
}
