import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-edit-icon-button',
                templateUrl: './edit-icon-button.component.html',
                styleUrls  : [ './edit-icon-button.component.scss' ]
            } )
export class EditIconButtonComponent {
    @Input() disabled: boolean = false;
    @Output() onClick = new EventEmitter();
}
