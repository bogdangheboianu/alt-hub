import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClientDataModule } from '@clients/data/client-data.module';
import { ClientDocumentsDataService } from '@clients/features/client-documents/client-documents-data.service';
import { DocumentSuccessMessage } from '@documents/config/document.constants';
import { CreateDocumentWithFiles } from '@documents/config/document.types';
import { DocumentDataModule } from '@documents/data/document-data.module';
import { DocumentsManagerComponent } from '@documents/features/documents-manager/documents-manager.component';
import { FileDto } from '@dtos/file-dto';
import { FileDataModule } from '@files/data/file-data.module';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-client-documents',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-documents-manager
                            [documents]="data.documents"
                            [loading]="data.documentsLoading"
                            [success]="data.documentsSuccess"
                            (onCreate)="createDocument($event)"
                            (onFileDownload)="downloadFile($event)"></app-documents-manager>
                    </ng-container>
                `,
                imports        : [
                    CommonModule,
                    ClientDataModule,
                    DocumentDataModule,
                    DocumentsManagerComponent,
                    FileDataModule
                ],
                providers      : [ ClientDocumentsDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientDocumentsComponent implements OnInit {
    constructor(
        public readonly dataService: ClientDocumentsDataService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    createDocument(data: CreateDocumentWithFiles): void {
        this.dataService.createDocument( data );
        this.onDocumentCreateSuccess();
    }

    downloadFile(file: FileDto): void {
        this.dataService.downloadFile( file );
    }

    private onDocumentCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.documentsSuccess, this, () => {
            this.messageService.success( DocumentSuccessMessage.Created );
        } );
    }
}
