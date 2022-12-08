import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanyDataModule } from '@company/data/company-data.module';
import { ContainerComponent } from '@shared/ui/container.component';
import { HeaderComponent } from '@shared/ui/header.component';
import { TitleComponent } from '@shared/ui/title.component';
import { UserDataModule } from '@users/data/user-data.module';
import { UserCreateRoutingModule } from '@users/features/user-create/user-create-routing.module';
import { UserCreateComponent } from '@users/features/user-create/user-create.component';
import { UserCreateFormComponent } from '@users/ui/user-create-form.component';

@NgModule( {
               imports     : [
                   UserCreateRoutingModule,
                   UserDataModule,
                   CompanyDataModule,
                   ContainerComponent,
                   TitleComponent,
                   UserCreateFormComponent,
                   CommonModule,
                   HeaderComponent
               ],
               declarations: [ UserCreateComponent ]
           } )
export class UserCreateModule {
}
