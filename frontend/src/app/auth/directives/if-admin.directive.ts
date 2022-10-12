import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { takeOnce } from '@shared/custom-rxjs-operators';

@Directive( { selector: '[ifAdmin]' } )
export class IfAdminDirective implements OnInit {
    constructor(
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainer: ViewContainerRef,
        private readonly authSelectors: AuthSelectors
    ) {
    }

    ngOnInit(): void {
        this.authSelectors.isLoggedUserAdmin()
            .pipe( takeOnce )
            .subscribe( isAdmin => isAdmin
                                   ? this.viewContainer.createEmbeddedView( this.templateRef )
                                   : this.viewContainer.clear() );
    }
}
