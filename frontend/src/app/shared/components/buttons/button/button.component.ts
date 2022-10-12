import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'icon'
export type ButtonColor = | 'primary' | 'accent' | 'warn' | undefined
export type ButtonType = 'button' | 'submit';
export type IconPosition = 'after' | 'before';

@Component( {
                selector   : 'app-button',
                templateUrl: './button.component.html',
                styleUrls  : [ './button.component.scss' ]
            } )
export class ButtonComponent {
    @Input() text!: string;
    @Input() variant: ButtonVariant = 'basic';
    @Input() color?: ButtonColor;
    @Input() type: ButtonType = 'button';
    @Input() disabled: boolean = false;
    @Input() fullWidth: boolean = false;
    @Input() routerLink?: string;
    @Input() icon?: string;
    @Input() iconPosition?: IconPosition = 'before'

    @Output() onClick = new EventEmitter<void>();
}
