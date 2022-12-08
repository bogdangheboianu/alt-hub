import { NgIf } from '@angular/common';
import { Component, Host, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonDirective } from '@shared/ui/button/button.directive';
import { ButtonModule } from '@shared/ui/button/button.module';

@Component( {
                standalone: true,
                selector  : 'app-download-button',
                template  : `
                    <button
                        *ngIf="!outlined && !iconOnly"
                        mat-raised-button
                        color="primary"
                        [disabled]="btn.disabled"
                        [class.w-100]="btn.fullWidth"
                        [matTooltip]="tooltip"
                        (click)="btn.onClick.emit()">
                        <mat-icon>file_download</mat-icon>
                        <span class="mx-1">{{ label }}</span>
                    </button>
                    <button
                        *ngIf="outlined && !iconOnly"
                        mat-stroked-button
                        color="primary"
                        [disabled]="btn.disabled"
                        [class.w-100]="btn.fullWidth"
                        [matTooltip]="tooltip"
                        (click)="btn.onClick.emit()">
                        <mat-icon>file_download</mat-icon>
                        <span class="mx-1">{{ label }}</span>
                    </button>
                    <button *ngIf="iconOnly"
                            mat-icon-button
                            color="primary"
                            matTooltipPosition="right"
                            [class.disabled]="btn.disabled"
                            [matTooltip]="tooltip"
                            (click)="btn.onClick.emit()">
                        <mat-icon>file_download</mat-icon>
                    </button>
                `,
                styleUrls : [ './button.scss' ],
                imports   : [
                    MatButtonModule,
                    ButtonModule,
                    MatIconModule,
                    NgIf,
                    MatTooltipModule
                ]
            } )
export class DownloadButtonComponent {
    @Input()
    label: string = 'Download';

    @Input()
    outlined: boolean = false;

    @Input()
    iconOnly = false;

    @Input()
    tooltip = 'Download';

    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
