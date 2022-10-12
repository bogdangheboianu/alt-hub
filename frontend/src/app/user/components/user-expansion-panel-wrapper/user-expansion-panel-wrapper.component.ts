import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-user-expansion-panel',
                templateUrl: './user-expansion-panel-wrapper.component.html',
                styleUrls  : [ './user-expansion-panel-wrapper.component.scss' ]
            } )
export class UserExpansionPanelWrapperComponent {
    @Input() title!: string;
    @Input() icon!: string;
    @Input() expanded = false;

    @Output() opened = new EventEmitter();
    @Output() closed = new EventEmitter();
}
