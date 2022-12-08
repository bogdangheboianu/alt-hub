import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ButtonModule } from '@shared/ui/button/button.module';
import { CreateButtonComponent } from '@shared/ui/button/create-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';
import { UserDataModule } from '@users/data/user-data.module';
import { UserListRoutingModule } from '@users/features/user-list/user-list-routing.module';
import { UserListComponent } from '@users/features/user-list/user-list.component';
import { UserListTableComponent } from '@users/ui/user-list-table.component';

@NgModule( {
               imports     : [
                   UserListRoutingModule,
                   UserDataModule,
                   UserListTableComponent,
                   HeaderComponent,
                   TitleComponent,
                   CreateButtonComponent,
                   ButtonModule,
                   ContainerComponent,
                   MatTabsModule,
                   CommonModule
               ],
               declarations: [ UserListComponent ]
           } )
export class UserListModule {
}
