import { Component, EventEmitter, Input, Output } from '@angular/core';

export type NextButtonLabel = 'Next' | 'Save' | 'Finish'

@Component( {
                selector   : 'app-next-button',
                templateUrl: './next-button.component.html',
                styleUrls  : [ './next-button.component.scss' ]
            } )
export class NextButtonComponent {
    @Input() disabled: boolean = false;
    @Input() text: NextButtonLabel = 'Next';

    @Output() onClick = new EventEmitter();
}
