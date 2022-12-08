import { Injectable } from '@angular/core';
import { ClientSelectors } from '@clients/data/client.selectors';
import { CreateDocumentWithFiles } from '@documents/config/document.types';
import { DocumentActions } from '@documents/data/document.actions';
import { DocumentSelectors } from '@documents/data/document.selectors';
import { ClientDto } from '@dtos/client-dto';
import { DocumentDto } from '@dtos/document-dto';
import { FileDto } from '@dtos/file-dto';
import { FileActions } from '@files/data/file.actions';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';

export interface ClientDocumentsComponentData {
    documents: DocumentDto[];
    documentsLoading: boolean;
    documentsSuccess: boolean;
}

@Injectable()
export class ClientDocumentsDataService extends DetailsComponentDataService<ClientDto, ClientDocumentsComponentData> {
    constructor(
        private readonly clientSelectors: ClientSelectors,
        private readonly documentActions: DocumentActions,
        private readonly documentSelectors: DocumentSelectors,
        private readonly fileActions: FileActions
    ) {
        super( clientSelectors );
    }

    createDocument(data: CreateDocumentWithFiles): void {
        this.entity.then( client => this.documentActions.createDocument( { type: data.type, clientsIds: [ client.id ] }, data.files ) );
    }

    downloadFile(file: FileDto): void {
        this.fileActions.downloadFile( file );
    }

    protected override onInit(): void {
        this.loadClientDocuments();
    }

    protected override dataSource(): ComponentDataSource<ClientDocumentsComponentData> {
        return {
            documents       : this.documentSelectors.selectAll(),
            documentsLoading: this.documentSelectors.selectLoading(),
            documentsSuccess: this.documentSelectors.selectSuccess()
        };
    }

    private loadClientDocuments(): void {
        this.entity$.subscribe( client => this.documentActions.loadAllDocuments( { clientsIds: [ client.id ] } ) );
    }
}
