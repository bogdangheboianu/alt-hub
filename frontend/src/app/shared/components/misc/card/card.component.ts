import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-card',
                templateUrl: './card.component.html',
                styleUrls  : [ './card.component.scss' ]
            } )
export class CardComponent {
    @Input() hoverEffect = false;
    @Input() height?: string;

    @Output() onClick = new EventEmitter();

    cardClicked(): void {
        if( this.hoverEffect ) {
            this.onClick.emit();
        }
    }
}
