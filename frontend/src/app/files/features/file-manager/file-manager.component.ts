import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FileManagerModalData } from '@files/config/file.interfaces';

// TODO: in progress
@Component( {
                standalone     : true,
                selector       : 'app-file-manager',
                template       : `
                    <h1 mat-dialog-title>File manager</h1>
                    <div mat-dialog-content>

                    </div>
                `,
                imports        : [
                    CommonModule,
                    MatDialogModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class FileManagerComponent {
    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: FileManagerModalData
    ) {
    }
}
