import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentStore } from '@documents/data/document.store';
import { CreateDocumentDto } from '@dtos/create-document-dto';
import { DocumentDto } from '@dtos/document-dto';
import { GetAllDocumentsParamsDto } from '@dtos/get-all-documents-params-dto';
import { ApiResult } from '@shared/api/api-result';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiService } from '@shared/api/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentApiService extends ApiService {
    constructor(private documentStore: DocumentStore) {
        super( documentStore );
    }

    getAllDocuments(params?: GetAllDocumentsParamsDto): Observable<ApiResult<DocumentDto[]>> {
        const queryParams = new HttpParams()
            .appendAll( {
                            usersIds    : params?.usersIds?.join( ',' ) ?? [],
                            companiesIds: params?.companiesIds?.join( ',' ) ?? [],
                            clientsIds  : params?.clientsIds?.join( ',' ) ?? []
                        } );
        return this.getWithParams( apiRoutes.documents.base, queryParams, this.documentStore.onDocumentListLoaded.bind( this.documentStore ) );
    }

    createDocument(data: CreateDocumentDto, files: File[]): Observable<ApiResult<DocumentDto>> {
        const formData = new FormData();
        files.forEach( file => formData.append( 'files', file ) );
        formData.append( 'type', data.type );
        formData.append( 'usersIds', data.usersIds?.join( ',' ) ?? '' );

        return this.postWithFormData( apiRoutes.documents.base, formData, this.documentStore.onDocumentCreated.bind( this.documentStore ) );
    }
}
