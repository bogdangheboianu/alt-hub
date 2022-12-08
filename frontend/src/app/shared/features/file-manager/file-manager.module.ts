import { NgModule } from '@angular/core';
import { CsvFileDownloadService } from '@shared/features/file-manager/csv-file-download.service';

@NgModule( {
               providers: [ CsvFileDownloadService ]
           } )
export class FileManagerModule {
}
