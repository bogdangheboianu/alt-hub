import { Component, Host } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonDirective } from '@shared/ui/button/button.directive';
import { ButtonModule } from '@shared/ui/button/button.module';

@Component( {
                standalone: true,
                selector  : 'app-save-button',
                template  : `
                    <button mat-raised-button
                            color="primary"
                            type="submit"
                            [disabled]="btn.disabled"
                            [class.w-100]="btn.fullWidth"
                            (click)="btn.onClick.emit()">Save
                    </button>
                `,
                styleUrls : [ './button.scss' ],
                imports   : [
                    MatButtonModule,
                    ButtonModule
                ]
            } )
export class SaveButtonComponent {
    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
