import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoginRoutingModule } from '@auth/features/login/login-routing.module';
import { LoginComponent } from '@auth/features/login/login.component';
import { LoginFormComponent } from '@auth/ui/login-form.component';

@NgModule( {
               imports     : [
                   CommonModule,
                   LoginRoutingModule,
                   MatCardModule,
                   LoginFormComponent
               ],
               declarations: [ LoginComponent ]
           } )
export class LoginModule {
}
