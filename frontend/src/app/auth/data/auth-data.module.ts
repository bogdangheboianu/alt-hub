import { NgModule } from '@angular/core';
import { AuthApiService } from '@auth/data/auth-api.service';
import { AuthActions } from '@auth/data/auth.actions';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { AuthStore } from '@auth/data/auth.store';

@NgModule( {
               providers: [
                   AuthStore,
                   AuthApiService,
                   AuthSelectors,
                   AuthActions
               ]
           } )
export class AuthDataModule {
}
