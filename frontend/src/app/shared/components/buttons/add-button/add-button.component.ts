import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-add-button',
                templateUrl: './add-button.component.html',
                styleUrls  : [ './add-button.component.scss' ]
            } )
export class AddButtonComponent {
    @Input() resourceName!: string;
    @Output() onClick = new EventEmitter();

    get text() {
        return `Add ${ this.resourceName.toLowerCase()
                           .trim() }`;
    }
}
