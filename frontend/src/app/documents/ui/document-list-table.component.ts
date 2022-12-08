import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DocumentPipesModule } from '@documents/pipes/document-pipes.module';
import { DocumentDto } from '@dtos/document-dto';
import { FileDto } from '@dtos/file-dto';
import { FileListComponent } from '@files/ui/file-list.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';

@Component( {
                standalone     : true,
                selector       : 'app-document-list-table',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <table mat-table multiTemplateDataRows [dataSource]="documents" class="darker-header">
                        <ng-container matColumnDef="type">
                            <th mat-header-cell *matHeaderCellDef>Type</th>
                            <td mat-cell *matCellDef="let document"> {{ document.type | formatDocumentType }} </td>
                        </ng-container>
                        <ng-container matColumnDef="files">
                            <th mat-header-cell *matHeaderCellDef>Files</th>
                            <td mat-cell *matCellDef="let document"> {{ document.files.length }} </td>
                        </ng-container>
                        <ng-container matColumnDef="expand">
                            <th mat-header-cell *matHeaderCellDef aria-label="row actions"></th>
                            <td mat-cell *matCellDef="let document">
                                <button mat-icon-button aria-label="expand row" (click)="onExpandButtonClick(document); $event.stopPropagation()">
                                    <mat-icon *ngIf="expandedDocument?.id !== document.id">keyboard_arrow_down</mat-icon>
                                    <mat-icon *ngIf="expandedDocument?.id === document.id">keyboard_arrow_up</mat-icon>
                                </button>
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="expandedDocument">
                            <td mat-cell *matCellDef="let document" [attr.colspan]="columns.length">
                                <div class="document-detail" [@detailExpand]="document.id == expandedDocument?.id ? 'expanded' : 'collapsed'">
                                    <app-file-list
                                        [files]="document.files!"
                                        (onDownload)="onDownloadFileButtonClick($event)"></app-file-list>
                                </div>
                            </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
                        <tr mat-row *matRowDef="let document; columns: columns;"
                            class="document-row"
                            [class.document-expanded-row]="expandedDocument?.id === document.id"
                            (click)="onExpandButtonClick(document)">
                        </tr>
                        <tr mat-row *matRowDef="let document; columns: ['expandedDocument']" class="document-detail-row"></tr>
                    </table>
                `,
                styles         : [
                    `
                        table {
                            width: 100%;
                        }

                        tr.document-detail-row {
                            height: 0;
                            cursor: default;
                            background: none;
                        }

                        tr.document-detail-row:hover {
                            background: none !important;
                        }

                        tr.document-row:not(.document-expanded-row):hover {
                            background: whitesmoke;
                        }

                        tr.document-row:not(.document-expanded-row):active {
                            background: #efefef;
                        }

                        .document-row td {
                            border-bottom-width: 0;
                        }

                        .document-detail {
                            overflow: hidden;
                            display: flex;
                            cursor: default;
                            background: none;
                        }
                    `
                ],
                animations     : [
                    trigger( 'detailExpand', [
                        state( 'collapsed', style( { height: '0px', minHeight: '0' } ) ),
                        state( 'expanded', style( { height: '*' } ) ),
                        transition( 'expanded <=> collapsed', animate( '225ms cubic-bezier(0.4, 0.0, 0.2, 1)' ) )
                    ] )
                ],
                imports        : [
                    CommonModule,
                    LoadingBarComponent,
                    MatTableModule,
                    DocumentPipesModule,
                    MatButtonModule,
                    MatIconModule,
                    FileListComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class DocumentListTableComponent {
    @Input()
    documents!: DocumentDto[];

    @Input()
    loading!: boolean;

    @Output()
    onFileDownload = new EventEmitter<FileDto>();

    expandedDocument: DocumentDto | null = null;

    get columns(): string[] {
        return [ 'type', 'files', 'expand' ];
    }

    onExpandButtonClick(document: DocumentDto): void {
        this.expandedDocument = this.expandedDocument?.id === document.id
                                ? null
                                : document;
    }

    onDownloadFileButtonClick(file: FileDto): void {
        this.onFileDownload.emit( file );
    }
}
