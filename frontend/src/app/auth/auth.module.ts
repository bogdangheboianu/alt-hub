import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { AuthRoutingModule } from '@auth/auth-routing.module';
import { AuthButtonComponent } from '@auth/components/auth-button/auth-button.component';
import { LoginFormComponent } from '@auth/components/login-form/login-form.component';
import { IfAdminDirective } from '@auth/directives/if-admin.directive';
import { JwtInterceptor } from '@auth/interceptors/jwt.interceptor';
import { LoginPageComponent } from '@auth/pages/login-page/login-page.component';
import { AuthService } from '@auth/services/auth.service';
import { AuthActions } from '@auth/store/auth.actions';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { AuthStore } from '@auth/store/auth.store';
import { SharedModule } from '@shared/shared.module';

@NgModule( {
               declarations: [
                   LoginPageComponent,
                   LoginFormComponent,
                   AuthButtonComponent,
                   IfAdminDirective
               ],
               imports     : [
                   CommonModule,
                   AuthRoutingModule,
                   ReactiveFormsModule,
                   MatFormFieldModule,
                   MatInputModule,
                   MatButtonModule,
                   MatCardModule,
                   MatGridListModule,
                   SharedModule
               ],
               exports     : [
                   IfAdminDirective,
                   AuthButtonComponent
               ],
               providers   : [
                   AuthService,
                   JwtInterceptor,
                   AuthStore,
                   AuthSelectors,
                   AuthActions
               ]
           } )
export class AuthModule {
}
