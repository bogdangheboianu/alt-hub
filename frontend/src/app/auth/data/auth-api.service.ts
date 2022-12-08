import { Injectable } from '@angular/core';
import { AuthStore } from '@auth/data/auth.store';
import { LoginResponseDto } from '@dtos/login-response-dto';
import { LoginWithCredentialsDto } from '@dtos/login-with-credentials-dto';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiResult } from '@shared/api/api-result';
import { ApiService } from '@shared/api/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthApiService extends ApiService {
    constructor(private readonly authStore: AuthStore) {
        super( authStore );
    }

    login(data: LoginWithCredentialsDto): Observable<ApiResult<LoginResponseDto>> {
        return this.post( apiRoutes.auth.login, data, this.authStore.onLogin.bind( this.authStore ) );
    }
}
