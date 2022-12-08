import { NgModule } from '@angular/core';
import { FiscalApiService } from '@fiscal/data/fiscal-api.service';
import { FiscalActions } from '@fiscal/data/fiscal.actions';
import { FiscalSelectors } from '@fiscal/data/fiscal.selectors';
import { FiscalStore } from '@fiscal/data/fiscal.store';

@NgModule( {
               providers: [
                   FiscalStore,
                   FiscalActions,
                   FiscalSelectors,
                   FiscalApiService
               ]
           } )
export class FiscalDataModule {
}
