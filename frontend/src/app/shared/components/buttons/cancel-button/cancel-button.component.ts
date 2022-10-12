import { Component, EventEmitter, Input, Output } from '@angular/core';

type Variant = 'basic' | 'stroked'

@Component( {
                selector   : 'app-cancel-button',
                templateUrl: './cancel-button.component.html',
                styleUrls  : [ './cancel-button.component.scss' ]
            } )
export class CancelButtonComponent {
    @Input() disabled: boolean = false;
    @Input() variant: Variant = 'basic';
    @Output() onClick = new EventEmitter();
}
