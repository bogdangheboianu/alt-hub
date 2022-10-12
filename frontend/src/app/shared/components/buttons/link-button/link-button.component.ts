import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { takeOnce } from '@shared/custom-rxjs-operators';
import { map, of } from 'rxjs';

@Component( {
                selector   : 'app-link-button',
                templateUrl: './link-button.component.html',
                styleUrls  : [ './link-button.component.scss' ]
            } )
export class LinkButtonComponent implements OnInit {
    @Input() text!: string;
    @Input() icon?: string;
    @Input() disableIfNotAdmin = false;

    @Output() onClick = new EventEmitter();

    disabled$ = of( false );

    constructor(private _authSelectors: AuthSelectors) {
    }

    ngOnInit(): void {
        if( this.disableIfNotAdmin ) {
            this.disabled$ = this._authSelectors.isLoggedUserAdmin()
                                 .pipe(
                                     takeOnce,
                                     map( isAdmin => !isAdmin )
                                 );
        }
    }

    clicked(): void {
        this.disabled$
            .pipe( takeOnce )
            .subscribe( isDisabled => {
                if( !isDisabled ) {
                    this.onClick.emit();
                }
            } );
    }
}
