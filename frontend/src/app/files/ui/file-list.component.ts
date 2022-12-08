import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FileDto } from '@dtos/file-dto';
import { ButtonModule } from '@shared/ui/button/button.module';
import { DownloadButtonComponent } from '@shared/ui/button/download-button.component';

@Component( {
                standalone     : true,
                selector       : 'app-file-list',
                template       : `
                    <mat-list>
                        <div mat-subheader class="py-1">Files</div>
                        <mat-list-item *ngFor="let file of files">
                            <mat-icon mat-list-icon color="primary">description</mat-icon>
                            <div mat-line>
                                <span>{{ file.name }}</span>
                                <app-download-button
                                    appButton
                                    [iconOnly]="true"
                                    (onClick)="onDownload.emit(file)"></app-download-button>
                            </div>
                        </mat-list-item>
                    </mat-list>
                `,
                imports        : [
                    CommonModule,
                    MatListModule,
                    MatIconModule,
                    DownloadButtonComponent,
                    ButtonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class FileListComponent {
    @Input()
    files!: FileDto[];

    @Output()
    onDownload = new EventEmitter<FileDto>();
}
