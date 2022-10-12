import { Component, Input } from '@angular/core';

@Component( {
                selector   : 'app-create-page-wrapper',
                templateUrl: './create-page-wrapper.component.html',
                styleUrls  : [ './create-page-wrapper.component.scss' ]
            } )
export class CreatePageWrapperComponent {
    @Input() pageTitle!: string;
}
