import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { AppR } from '@shared/config/constants/routes';
import { map, Observable } from 'rxjs';

@Injectable( { providedIn: 'root' } )
export class NotAuthGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly authQuery: AuthSelectors
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> {
        return this.authQuery.isAuthenticated()
                   .pipe(
                       map( (isAuthenticated: boolean) => isAuthenticated
                                                          ? this.router.parseUrl( AppR.dashboard.simple )
                                                          : true
                       )
                   );
    }
}
