import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { AppR } from '@shared/constants/routes';
import { map, Observable } from 'rxjs';

@Injectable( { providedIn: 'root' } )
export class IsAdminGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly authSelectors: AuthSelectors
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> {
        return this.authSelectors.isLoggedUserAdmin()
                   .pipe(
                       map( isAdmin => isAdmin
                                       ? true
                                       : this.router.parseUrl( AppR.dashboard.simple ) )
                   );
    }
}
