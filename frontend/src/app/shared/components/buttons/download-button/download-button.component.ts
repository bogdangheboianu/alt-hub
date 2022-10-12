import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-download-button',
                templateUrl: './download-button.component.html',
                styleUrls  : [ './download-button.component.scss' ]
            } )
export class DownloadButtonComponent {
    @Input() text = 'Download';
    @Output() onClick = new EventEmitter();
}
