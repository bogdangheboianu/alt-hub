import { Injectable } from '@angular/core';
import { AuthState, AuthStore } from '@auth/data/auth.store';
import { jwtIsValid } from '@auth/config/auth.functions';
import { UserDto } from '@dtos/user-dto';
import { BaseSelector } from '@config/store/store.models';
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
                       map( loggedUser => loggedUser?.account.isAdmin ?? false )
                   );
    }
}
