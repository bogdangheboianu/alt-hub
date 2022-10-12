import { Component, Input } from '@angular/core';

@Component( {
                selector   : 'app-list-tab-wrapper',
                templateUrl: './list-tab-wrapper.component.html',
                styleUrls  : [ './list-tab-wrapper.component.scss' ]
            } )
export class ListTabWrapperComponent {
    @Input() title!: string;
    @Input() icon?: string;
}
