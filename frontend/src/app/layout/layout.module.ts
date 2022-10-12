import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NavbarLoggedUserComponent } from '@layout/components/navbar-logged-user/navbar-logged-user.component';
import { NavbarComponent } from '@layout/components/navbar/navbar.component';
import { SidebarComponent } from '@layout/components/sidebar/sidebar.component';
import { PublicLayoutComponent } from '@layout/public-layout/public-layout.component';
import { SecureLayoutComponent } from '@layout/secure-layout/secure-layout.component';
import { SearchModule } from '@search/search.module';
import { SharedModule } from '@shared/shared.module';
import { UserModule } from '@user/user.module';

@NgModule( {
               imports     : [
                   CommonModule,
                   RouterModule,
                   MatToolbarModule,
                   MatIconModule,
                   MatButtonModule,
                   MatSidenavModule,
                   MatListModule,
                   MatMenuModule,
                   UserModule,
                   SearchModule,
                   SharedModule
               ],
               declarations: [
                   PublicLayoutComponent,
                   SecureLayoutComponent,
                   NavbarComponent,
                   NavbarLoggedUserComponent,
                   SidebarComponent
               ]
           } )
export class LayoutModule {
}
