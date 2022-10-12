import { Pipe, PipeTransform } from '@angular/core';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { Observable } from 'rxjs';

@Pipe( { name: 'isAdmin', pure: true } )
export class UserIsAdminPipe implements PipeTransform {
    constructor(
        private readonly authSelectors: AuthSelectors
    ) {
    }

    transform(_: null): Observable<boolean> {
        return this.authSelectors.isLoggedUserAdmin();
    }

}
