import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentCreateFormModalData } from '@documents/config/document.interfaces';
import { CreateDocumentWithFiles } from '@documents/config/document.types';
import { DocumentTypeEnum } from '@dtos/document-type-enum';
import { FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { FileUploadComponent } from '@shared/ui/file-upload.component';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SelectInputComponent } from '@shared/ui/input/select-input.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-document-create-form',
                template       : `
                    <app-form-modal
                        title="Add document"
                        [loading]="loading"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()">
                        <form *ngIf="form" [formGroup]="form">
                            <app-select-input
                                appInput
                                formControlName="type"
                                label="Type"
                                [options]="documentTypeEnum | enumToSelectInputOptions"
                                [required]="true"></app-select-input>
                            <app-file-upload
                                label="Select files"
                                [disabled]="loading"
                                [acceptMultiple]="true"
                                [showSummary]="true"
                                (onUpload)="onFilesUpload($event)"></app-file-upload>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    CommonModule,
                    FormModalComponent,
                    ReactiveFormsModule,
                    SelectInputComponent,
                    InputModule,
                    SharedPipesModule,
                    FileUploadComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class DocumentCreateFormComponent extends AbstractForm<CreateDocumentWithFiles> {
    override loading = false;
    override onSubmit: SubmitFn<CreateDocumentWithFiles>;
    override initialValues = null;
    documentTypeEnum = DocumentTypeEnum;

    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: DocumentCreateFormModalData
    ) {
        super( { loadingSrc$: data.loading$ } );
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
    }

    onFilesUpload(files: File[]): void {
        this.form.patchValue( { files: [ ...this.form.value.files!, ...files ] } );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<CreateDocumentWithFiles> {
        return {
            type      : [ null, [ Validators.required ] ],
            usersIds  : [ undefined ],
            clientsIds: [ undefined ],
            files     : [ [] ]
        };
    }
}
