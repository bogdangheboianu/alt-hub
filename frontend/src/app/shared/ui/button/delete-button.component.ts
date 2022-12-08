import { Component, Host } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonDirective } from '@shared/ui/button/button.directive';
import { ButtonModule } from '@shared/ui/button/button.module';

@Component( {
                standalone: true,
                selector  : 'app-delete-button',
                template  : `
                    <button mat-stroked-button
                            color="warn"
                            [disabled]="btn.disabled"
                            [class.w-100]="btn.fullWidth"
                            (click)="btn.onClick.emit()">Delete
                    </button>
                `,
                styleUrls : [ './button.scss' ],
                imports   : [
                    MatButtonModule,
                    ButtonModule
                ]
            } )
export class DeleteButtonComponent {
    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
