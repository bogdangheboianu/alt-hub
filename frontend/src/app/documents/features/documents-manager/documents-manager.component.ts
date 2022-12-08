import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentCreateFormModalData } from '@documents/config/document.interfaces';
import { CreateDocumentWithFiles } from '@documents/config/document.types';
import { DocumentCreateFormComponent } from '@documents/ui/document-create-form.component';
import { DocumentListTableComponent } from '@documents/ui/document-list-table.component';
import { DocumentDto } from '@dtos/document-dto';
import { FileDto } from '@dtos/file-dto';
import { ModalService } from '@shared/features/modal/modal.service';
import { ButtonModule } from '@shared/ui/button/button.module';
import { PrimaryButtonComponent } from '@shared/ui/button/primary-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { BehaviorSubject } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-documents-manager',
                template       : `
                    <section class="p-3">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <app-section-title
                                title="Documents"
                                icon="file_present"
                                [withMarginBottom]="false"></app-section-title>
                            <app-primary-button
                                appButton
                                label="Add document"
                                icon="note_add"
                                (onClick)="openDocumentCreateFormModal()"></app-primary-button>
                        </div>
                        <app-document-list-table
                            [documents]="documents"
                            [loading]="loading"
                            (onFileDownload)="onFileDownload.emit($event)"></app-document-list-table>
                    </section>
                `,
                imports        : [
                    CommonModule,
                    DocumentListTableComponent,
                    SectionTitleComponent,
                    PrimaryButtonComponent,
                    ButtonModule,
                    ContainerComponent,
                    DocumentCreateFormComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class DocumentsManagerComponent {
    @Input()
    documents!: DocumentDto[];

    @Input()
    set loading(value: boolean) {
        this._loading = value;
        this.loading$.next( value );
    }

    get loading(): boolean {
        return this._loading;
    }

    @Input()
    set success(value: boolean) {
        if( value ) {
            this.closeDocumentCreateFormModal();
        }
    }

    @Output()
    onCreate = new EventEmitter<CreateDocumentWithFiles>();

    @Output()
    onFileDownload = new EventEmitter<FileDto>();

    private readonly loading$ = new BehaviorSubject( false );
    private _loading = false;

    constructor(
        private readonly modalService: ModalService
    ) {
    }

    openDocumentCreateFormModal(): void {
        this.modalService.openSmModal<DocumentCreateFormModalData>( DocumentCreateFormComponent, this, {
            loading$: this.loading$,
            onSubmit: (data: CreateDocumentWithFiles) => this.onCreate.emit( data ),
            onCancel: this.closeDocumentCreateFormModal.bind( this )
        } );
    }

    closeDocumentCreateFormModal(): void {
        this.modalService.close( DocumentCreateFormComponent );
    }
}
