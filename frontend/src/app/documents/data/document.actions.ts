import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { DocumentApiService } from '@documents/data/document-api.service';
import { CreateDocumentDto } from '@dtos/create-document-dto';
import { GetAllDocumentsParamsDto } from '@dtos/get-all-documents-params-dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DocumentActions {
    constructor(
        private documentApiService: DocumentApiService
    ) {
    }

    @action( 'Load all documents' )
    loadAllDocuments(params?: GetAllDocumentsParamsDto): void {
        firstValueFrom( this.documentApiService.getAllDocuments( params ) )
            .then();
    }

    @action( 'Create client' )
    createDocument(data: CreateDocumentDto, files: File[]): void {
        firstValueFrom( this.documentApiService.createDocument( data, files ) )
            .then();
    }
}
