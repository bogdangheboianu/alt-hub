import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-delete-icon-button',
                templateUrl: './delete-icon-button.component.html',
                styleUrls  : [ './delete-icon-button.component.scss' ]
            } )
export class DeleteIconButtonComponent {
    @Input() disabled: boolean = false;
    @Output() onClick = new EventEmitter();
}
