import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { IsAdminModule } from '@auth/directives/is-admin/is-admin.module';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { ProjectListRoutingModule } from '@projects/features/project-list/project-list-routing.module';
import { ProjectListComponent } from '@projects/features/project-list/project-list.component';
import { ProjectListTableComponent } from '@projects/ui/project-list-table.component';
import { ButtonModule } from '@shared/ui/button/button.module';
import { CreateButtonComponent } from '@shared/ui/button/create-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';

@NgModule( {
               imports     : [
                   CommonModule,
                   ProjectListRoutingModule,
                   HeaderComponent,
                   TitleComponent,
                   CreateButtonComponent,
                   ContainerComponent,
                   ProjectListTableComponent,
                   ProjectDataModule,
                   ButtonModule,
                   IsAdminModule,
                   AuthDataModule
               ],
               declarations: [ ProjectListComponent ]
           } )
export class ProjectListModule {
}
