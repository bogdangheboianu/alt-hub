import { NgIf } from '@angular/common';
import { Component, Host, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDirective } from '@shared/ui/button/button.directive';
import { ButtonModule } from '@shared/ui/button/button.module';
import { ButtonType } from '@shared/ui/button/button.types';

@Component( {
                standalone: true,
                selector  : 'app-primary-button',
                template  : `
                    <button *ngIf="!outlined"
                            mat-raised-button
                            color="primary"
                            [type]="type"
                            [disabled]="btn.disabled"
                            [class.w-100]="btn.fullWidth"
                            (click)="btn.onClick.emit()">
                        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
                        <span class="mx-1">{{ label }}</span>
                    </button>
                    <button *ngIf="outlined" mat-stroked-button
                            color="primary"
                            [type]="type"
                            [disabled]="btn.disabled"
                            [class.w-100]="btn.fullWidth"
                            (click)="btn.onClick.emit()">
                        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
                        <span class="mx-1">{{ label }}</span>
                    </button>
                `,
                styleUrls : [ './button.scss' ],
                imports   : [
                    MatButtonModule,
                    ButtonModule,
                    MatIconModule,
                    NgIf
                ]
            } )
export class PrimaryButtonComponent {
    @Input()
    label!: string;

    @Input()
    icon?: string;

    @Input()
    type: ButtonType = 'submit';

    @Input()
    outlined = false;

    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
