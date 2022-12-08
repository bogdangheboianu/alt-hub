import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { getParamFromRoute } from '@shared/config/functions/route.functions';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { combineLatest } from 'rxjs';

@Directive( { selector: '[isOwnProfilePage]' } )
@UntilDestroy()
export class IsOwnProfilePageDirective {
    constructor(
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainer: ViewContainerRef,
        private readonly authSelectors: AuthSelectors,
        private readonly route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        combineLatest( [
                           this.authSelectors.selectLoggedUser(),
                           getParamFromRoute( 'id', this.route )
                       ] )
            .pipe( takeUntilDestroy( this ) )
            .subscribe( ([ loggedUser, routeUserId ]) => loggedUser?.id === routeUserId
                                                         ? this.viewContainer.createEmbeddedView( this.templateRef )
                                                         : this.viewContainer.clear() );
    }
}
