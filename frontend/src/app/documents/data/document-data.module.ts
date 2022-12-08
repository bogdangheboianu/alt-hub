import { NgModule } from '@angular/core';
import { DocumentApiService } from '@documents/data/document-api.service';
import { DocumentActions } from '@documents/data/document.actions';
import { DocumentSelectors } from '@documents/data/document.selectors';
import { DocumentStore } from '@documents/data/document.store';

@NgModule( {
               providers: [
                   DocumentApiService,
                   DocumentStore,
                   DocumentActions,
                   DocumentSelectors
               ]
           } )
export class DocumentDataModule {
}
