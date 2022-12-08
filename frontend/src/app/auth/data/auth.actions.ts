import { Injectable } from '@angular/core';
import { AuthApiService } from '@auth/data/auth-api.service';
import { AuthStore } from '@auth/data/auth.store';
import { action, resetStores } from '@datorama/akita';
import { LoginWithCredentialsDto } from '@dtos/login-with-credentials-dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthActions {
    constructor(
        private readonly authStore: AuthStore,
        private readonly authService: AuthApiService
    ) {
    }

    @action( 'Login' )
    login(data: LoginWithCredentialsDto): void {
        firstValueFrom( this.authService.login( data ) )
            .then();
    }

    @action( 'Logout' )
    logout(): void {
        this.authStore.onLogout();
        resetStores();
    }
}
