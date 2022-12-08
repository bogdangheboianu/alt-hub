import { NgIf } from '@angular/common';
import { Component, Host, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonDirective } from '@shared/ui/button/button.directive';
import { ButtonModule } from '@shared/ui/button/button.module';

@Component( {
                standalone: true,
                selector  : 'app-create-button',
                template  : `
                    <button mat-raised-button
                            color="primary"
                            *ngIf="!iconOnly else iconButton"
                            [disabled]="btn.disabled"
                            [class.w-100]="btn.fullWidth"
                            (click)="btn.onClick.emit()">Create
                    </button>
                    <ng-template #iconButton>
                        <button mat-icon-button
                                color="primary"
                                matTooltip="Create"
                                matTooltipPosition="below"
                                [disabled]="btn.disabled"
                                (click)="btn.onClick.emit()">
                            <mat-icon class="lg">add</mat-icon>
                        </button>
                    </ng-template>
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
export class CreateButtonComponent {
    @Input()
    iconOnly = false;

    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
