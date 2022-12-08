import { NgIf } from '@angular/common';
import { Component, Host, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDirective } from '@shared/ui/button/button.directive';
import { ButtonModule } from '@shared/ui/button/button.module';

@Component( {
                standalone: true,
                selector  : 'app-edit-button',
                template  : `
                    <button mat-icon-button
                            color="accent"
                            [class.disabled]="btn.disabled"
                            (click)="btn.onClick.emit()">
                        <mat-icon>edit</mat-icon>
                        <span class="mx-1" *ngIf="!iconOnly">Edit</span>
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
export class EditButtonComponent {
    @Input()
    iconOnly = false;

    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
