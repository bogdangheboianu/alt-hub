import { Component, Input, OnInit } from '@angular/core';

type Size = 'large' | 'small' | 'medium'

@Component( {
                selector   : 'app-resource-icon',
                templateUrl: './resource-icon.component.html',
                styleUrls  : [ './resource-icon.component.scss' ]
            } )
export class ResourceIconComponent implements OnInit {
    @Input() name!: string;
    @Input() size: Size = 'medium';

    firstLetter = '';

    get isLarge(): boolean {
        return this.size === 'large';
    }

    get isSmall(): boolean {
        return this.size === 'small';
    }

    get isMedium(): boolean {
        return this.size === 'medium';
    }

    ngOnInit(): void {
        this.firstLetter = this.name[0].toUpperCase();
    }
}
