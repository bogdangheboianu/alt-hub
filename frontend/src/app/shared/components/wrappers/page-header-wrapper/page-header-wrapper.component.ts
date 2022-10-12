import { Component, Input } from '@angular/core';

@Component( {
                selector   : 'app-page-header-wrapper',
                templateUrl: './page-header-wrapper.component.html',
                styleUrls  : [ './page-header-wrapper.component.scss' ]
            } )
export class PageHeaderWrapperComponent {
    @Input() height?: string;
}
