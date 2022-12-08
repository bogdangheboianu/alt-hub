import { NgModule } from '@angular/core';
import { FileApiService } from '@files/data/file-api.service';
import { FileActions } from '@files/data/file.actions';
import { FileSelectors } from '@files/data/file.selectors';
import { FileStore } from '@files/data/file.store';

@NgModule( {
               providers: [
                   FileApiService,
                   FileStore,
                   FileActions,
                   FileSelectors
               ]
           } )
export class FileDataModule {
}
