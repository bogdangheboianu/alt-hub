import { NgModule } from '@angular/core';
import { UserApiService } from '@users/data/user-api.service';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';
import { UserStore } from '@users/data/user.store';

@NgModule( {
               providers: [
                   UserApiService,
                   UserStore,
                   UserActions,
                   UserSelectors
               ]
           } )
export class UserDataModule {
}
