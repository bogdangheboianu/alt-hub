import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component( {
                standalone     : true,
                selector       : 'app-file-upload',
                template       : `
                    <input #fileInput
                           hidden="true"
                           type="file"
                           [multiple]="acceptMultiple"
                           [accept]="accept"
                           (change)="onFileInputChange($event)" />
                    <button mat-stroked-button
                            color="primary"
                            [disabled]="disabled"
                            [class.disabled]="disabled"
                            (click)="fileInput.click()">
                        <mat-icon>file_upload</mat-icon>
                        <span class="mx-1">{{ label }}</span>
                    </button>
                    <ul *ngIf="showSummary" style="margin: 0" class="py-2">
                        <li *ngFor="let file of uploadedFiles">{{ file.name }}</li>
                    </ul>
                `,
                imports        : [
                    MatButtonModule,
                    MatIconModule,
                    CommonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class FileUploadComponent {
    @Input()
    label: string = 'Upload file';

    @Input()
    accept: string = '*/*';

    @Input()
    acceptMultiple = false;

    @Input()
    disabled = false;

    @Input()
    showSummary = false;

    @Output()
    onUpload = new EventEmitter<any>();

    uploadedFiles: File[] = [];

    onFileInputChange(event: any): void {
        this.uploadedFiles = event.target.files;
        this.onUpload.emit( this.uploadedFiles );
    }
}
