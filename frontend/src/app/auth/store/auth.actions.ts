import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth.store';
import { AppR } from '@shared/constants/routes';
import { action } from '@datorama/akita';
import { LoginWithCredentialsDto } from '@dtos/login-with-credentials.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthActions {
    constructor(
        private readonly authStore: AuthStore,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    @action( 'Login' )
    login(data: LoginWithCredentialsDto): void {
        firstValueFrom( this.authService.login( data ) )
            .then();
    }

    @action( 'Logout' )
    async logout(): Promise<void> {
        this.authStore.onLogout();
        await this.router.navigateByUrl( AppR.auth.login.full );
    }
}
