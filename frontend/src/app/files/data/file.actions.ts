import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { FileDto } from '@dtos/file-dto';
import { FileApiService } from '@files/data/file-api.service';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FileActions {
    constructor(
        private readonly fileApiService: FileApiService
    ) {
    }

    @action( 'Download file' )
    downloadFile(file: FileDto): void {
        firstValueFrom( this.fileApiService.downloadFile( file.id ) )
            .then( result => {
                if( result.isSuccessful() ) {
                    saveAs( result.data!, file.name );
                }
            } );
    }
}
