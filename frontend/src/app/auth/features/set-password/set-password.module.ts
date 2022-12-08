import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SetPasswordRoutingModule } from '@auth/features/set-password/set-password-routing.module';
import { SetPasswordComponent } from '@auth/features/set-password/set-password.component';
import { SetPasswordFormComponent } from '@auth/ui/set-password-form.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { UserDataModule } from '@users/data/user-data.module';

@NgModule( {
               imports     : [
                   SetPasswordRoutingModule,
                   UserDataModule,
                   ContainerComponent,
                   SetPasswordFormComponent,
                   CommonModule
               ],
               declarations: [ SetPasswordComponent ]
           } )
export class SetPasswordModule {
}
