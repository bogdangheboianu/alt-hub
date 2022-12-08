import { Injectable } from '@angular/core';
import { CreateDocumentWithFiles } from '@documents/config/document.types';
import { DocumentActions } from '@documents/data/document.actions';
import { DocumentSelectors } from '@documents/data/document.selectors';
import { DocumentDto } from '@dtos/document-dto';
import { FileDto } from '@dtos/file-dto';
import { UserDto } from '@dtos/user-dto';
import { FileActions } from '@files/data/file.actions';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { UserSelectors } from '@users/data/user.selectors';

export interface UserDocumentsComponentData {
    documents: DocumentDto[];
    documentsLoading: boolean;
    documentsSuccess: boolean;
}

@Injectable()
export class UserDocumentsDataService extends DetailsComponentDataService<UserDto, UserDocumentsComponentData> {
    constructor(
        private readonly userSelectors: UserSelectors,
        private readonly documentActions: DocumentActions,
        private readonly documentSelectors: DocumentSelectors,
        private readonly fileActions: FileActions
    ) {
        super( userSelectors );
    }

    createDocument(data: CreateDocumentWithFiles): void {
        this.entity.then( user => this.documentActions.createDocument( { type: data.type, usersIds: [ user.id ] }, data.files ) );
    }

    downloadFile(file: FileDto): void {
        this.fileActions.downloadFile( file );
    }

    protected override onInit(): void {
        this.loadUserDocuments();
    }

    protected override dataSource(): ComponentDataSource<UserDocumentsComponentData> {
        return {
            documents       : this.documentSelectors.selectAll(),
            documentsLoading: this.documentSelectors.selectLoading(),
            documentsSuccess: this.documentSelectors.selectSuccess()
        };
    }

    private loadUserDocuments(): void {
        this.entity$.subscribe( user => this.documentActions.loadAllDocuments( { usersIds: [ user.id ] } ) );
    }
}
