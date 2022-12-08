import { ChangeDetectionStrategy, Component, EventEmitter, Host, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonDirective } from '@shared/ui/button/button.directive';
import { ButtonModule } from '@shared/ui/button/button.module';

@Component( {
                standalone     : true,
                selector       : 'app-user-status-change-button',
                template       : `
                    <button mat-raised-button
                            color="accent"
                            [disabled]="btn.disabled"
                            [class.w-100]="true"
                            (click)="onClick.emit()">{{ label }}</button>
                `,
                imports        : [
                    MatButtonModule,
                    ButtonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class UserStatusChangeButtonComponent {
    @Input()
    label!: string;

    @Output()
    onClick = new EventEmitter();

    constructor(@Host() public readonly btn: ButtonDirective) {
    }
}
