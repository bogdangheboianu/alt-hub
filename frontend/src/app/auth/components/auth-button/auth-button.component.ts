import { Component, Input } from '@angular/core';

@Component( {
                selector   : 'app-auth-button',
                templateUrl: './auth-button.component.html',
                styleUrls  : [ './auth-button.component.scss' ]
            } )
export class AuthButtonComponent {
    @Input() text!: string;
    @Input() disabled!: boolean;
}
