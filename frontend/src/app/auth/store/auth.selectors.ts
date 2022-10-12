import { Injectable } from '@angular/core';
import { jwtIsValid } from '@auth/functions/jwt.functions';
import { AuthState, AuthStore } from '@auth/store/auth.store';
import { UserDto } from '@dtos/user.dto';
import { BaseSelector } from '@shared/store/base-selector';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthSelectors extends BaseSelector<AuthState> {
    constructor(protected authStore: AuthStore) {
        super( authStore );
    }

    selectAccessToken(): Observable<string | null> {
        return this.select( 'accessToken' );
    }

    selectRefreshToken(): Observable<string | null> {
        return this.select( 'refreshToken' );
    }

    isAuthenticated(): Observable<boolean> {
        return this.select( state => jwtIsValid( state.accessToken ) );
    }

    selectLoggedUser(): Observable<UserDto | null> {
        return this.select( 'loggedUser' );
    }

    isLoggedUserAdmin(): Observable<boolean> {
        return this.selectLoggedUser()
                   .pipe(
                       map( loggedUser => loggedUser?.isAdmin ?? false )
                   );
    }
}
