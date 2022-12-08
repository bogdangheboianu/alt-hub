import { NgModule } from '@angular/core';
import { ClientApiService } from '@clients/data/client-api.service';
import { ClientActions } from '@clients/data/client.actions';
import { ClientSelectors } from '@clients/data/client.selectors';
import { ClientStore } from '@clients/data/client.store';

@NgModule( {
               providers: [
                   ClientApiService,
                   ClientStore,
                   ClientActions,
                   ClientSelectors
               ]
           } )
export class ClientDataModule {
}
