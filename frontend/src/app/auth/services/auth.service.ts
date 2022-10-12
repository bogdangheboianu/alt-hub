import { Injectable } from '@angular/core';
import { apiRoutes } from '@shared/constants/api.routes';
import { ApiResult } from '@shared/models/api-result';
import { ApiService } from '@shared/services/api.service';
import { AuthStore } from '@auth/store/auth.store';
import { LoginResponseDto } from '@dtos/login-response.dto';
import { LoginWithCredentialsDto } from '@dtos/login-with-credentials.dto';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService extends ApiService {
    constructor(private readonly authStore: AuthStore) {
        super( authStore );
    }

    login(data: LoginWithCredentialsDto): Observable<ApiResult<LoginResponseDto>> {
        return this.post( apiRoutes.auth.login, data, this.authStore.onLogin.bind( this.authStore ) );
    }
}
