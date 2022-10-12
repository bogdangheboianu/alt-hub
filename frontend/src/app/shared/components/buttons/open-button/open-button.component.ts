import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-open-button',
                templateUrl: './open-button.component.html',
                styleUrls  : [ './open-button.component.scss' ]
            } )
export class OpenButtonComponent {
    @Input() text!: string;
    @Output() onClick = new EventEmitter();
}
