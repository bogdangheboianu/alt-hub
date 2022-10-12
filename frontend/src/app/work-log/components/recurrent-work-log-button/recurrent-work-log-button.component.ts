import { Component, EventEmitter, Output } from '@angular/core';

@Component( {
                selector   : 'app-recurrent-work-log-button',
                templateUrl: './recurrent-work-log-button.component.html',
                styleUrls  : [ './recurrent-work-log-button.component.scss' ]
            } )
export class RecurrentWorkLogButtonComponent {
    @Output() onClick = new EventEmitter();
}
