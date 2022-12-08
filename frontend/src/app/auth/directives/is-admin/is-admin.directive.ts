import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';

@Directive( { selector: '[isAdmin]' } )
@UntilDestroy()
export class IsAdminDirective implements OnInit {
    constructor(
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainer: ViewContainerRef,
        private readonly authSelectors: AuthSelectors
    ) {
    }

    ngOnInit(): void {
        this.authSelectors.isLoggedUserAdmin()
            .pipe( takeUntilDestroy( this ) )
            .subscribe( isAdmin => isAdmin
                                   ? this.viewContainer.createEmbeddedView( this.templateRef )
                                   : this.viewContainer.clear() );
    }
}
