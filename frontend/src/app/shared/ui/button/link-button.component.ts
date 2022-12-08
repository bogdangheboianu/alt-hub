import { NgIf } from '@angular/common';
import { Component, Host, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDirective } from '@shared/ui/button/button.directive';
import { ButtonModule } from '@shared/ui/button/button.module';

@Component( {
                standalone: true,
                selector  : 'app-link-button',
                template  : `
                    <button mat-button
                            color="primary"
                            class="link-button"
                            [disabled]="btn.disabled"
                            [class.disabled]="btn.disabled"
                            (click)="btn.onClick.emit()">
                        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
                        <span class="mx-1">{{ label }}</span>
                    </button>
                `,
                styleUrls : [ './button.scss' ],
                imports   : [
                    MatButtonModule,
                    MatIconModule,
                    NgIf,
                    ButtonModule
                ]
            } )
export class LinkButtonComponent {
    @Input()
    label!: string;

    @Input()
    icon?: string;

    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
