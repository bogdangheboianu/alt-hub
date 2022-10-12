import { Component, Input } from '@angular/core';

@Component( {
                selector   : 'app-list-page-wrapper',
                templateUrl: './list-page-wrapper.component.html',
                styleUrls  : [ './list-page-wrapper.component.scss' ]
            } )
export class ListPageWrapperComponent {
    @Input() pageTitle!: string;
    @Input() titleIcon!: string;
}
