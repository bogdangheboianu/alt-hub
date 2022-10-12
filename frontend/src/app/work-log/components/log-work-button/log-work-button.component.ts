import { Component, EventEmitter, Output } from '@angular/core';

@Component( {
                selector   : 'app-log-work-button',
                templateUrl: './log-work-button.component.html',
                styleUrls  : [ './log-work-button.component.scss' ]
            } )
export class LogWorkButtonComponent {
    @Output() onClick = new EventEmitter();
}
