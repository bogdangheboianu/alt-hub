import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-save-button',
                templateUrl: './save-button.component.html',
                styleUrls  : [ './save-button.component.scss' ]
            } )
export class SaveButtonComponent {
    @Input() fullWidth = false;
    @Input() disabled = false;

    @Output() onClick = new EventEmitter();
}
