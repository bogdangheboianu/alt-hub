import { Injectable } from '@angular/core';
import { CompanySelectors } from '@company/data/company.selectors';
import { CreateDocumentWithFiles } from '@documents/config/document.types';
import { DocumentActions } from '@documents/data/document.actions';
import { DocumentSelectors } from '@documents/data/document.selectors';
import { DocumentDto } from '@dtos/document-dto';
import { FileDto } from '@dtos/file-dto';
import { FileActions } from '@files/data/file.actions';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';

export interface CompanyDocumentsComponentData {
    documents: DocumentDto[];
    documentsLoading: boolean;
    documentsSuccess: boolean;
}

@Injectable()
export class CompanyDocumentsDataService extends BaseComponentDataService<CompanyDocumentsComponentData> {
    constructor(
        private readonly companySelectors: CompanySelectors,
        private readonly documentActions: DocumentActions,
        private readonly documentSelectors: DocumentSelectors,
        private readonly fileActions: FileActions
    ) {
        super( companySelectors );
    }

    createDocument(data: CreateDocumentWithFiles): void {
        this.documentActions.createDocument( { type: data.type }, data.files );
    }

    downloadFile(file: FileDto): void {
        this.fileActions.downloadFile( file );
    }

    protected override onInit(): void {
        this.loadCompanyDocuments();
    }

    protected override dataSource(): ComponentDataSource<CompanyDocumentsComponentData> {
        return {
            documents       : this.documentSelectors.selectAll(),
            documentsLoading: this.documentSelectors.selectLoading(),
            documentsSuccess: this.documentSelectors.selectSuccess()
        };
    }

    private loadCompanyDocuments(): void {
        this.documentActions.loadAllDocuments();
    }
}
