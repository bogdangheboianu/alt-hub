import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-prev-button',
                templateUrl: './prev-button.component.html',
                styleUrls  : [ './prev-button.component.scss' ]
            } )
export class PrevButtonComponent {
    @Input() disabled: boolean = false;
    @Output() onClick = new EventEmitter();
}
