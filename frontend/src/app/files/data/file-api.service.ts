import { Injectable } from '@angular/core';
import { FileStore } from '@files/data/file.store';
import { ApiResult } from '@shared/api/api-result';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiService } from '@shared/api/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class FileApiService extends ApiService {
    constructor(
        private readonly fileStore: FileStore
    ) {
        super( fileStore );
    }

    downloadFile(fileId: string): Observable<ApiResult<Blob>> {
        return this.getFile( `${ apiRoutes.files.base }/${ fileId }/download` );
    }
}
