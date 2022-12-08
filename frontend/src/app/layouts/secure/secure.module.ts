import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { SecureRoutingModule } from '@layouts/secure/secure-routing.module';
import { SecureComponent } from '@layouts/secure/secure.component';
import { SideMenuComponent } from '@shared/ui/side-menu.component';
import { TopBarComponent } from '@shared/ui/top-bar.component';

@NgModule( {
               imports     : [
                   SecureRoutingModule,
                   TopBarComponent,
                   SideMenuComponent,
                   CommonModule,
                   AuthDataModule
               ],
               declarations: [ SecureComponent ]
           } )
export class SecureModule {
}
