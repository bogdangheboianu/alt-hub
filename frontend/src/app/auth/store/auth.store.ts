import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { LoginResponseDto } from '@dtos/login-response.dto';
import { UserDto } from '@dtos/user.dto';
import { IBaseState } from '@shared/store/base-state.interface';
import { BaseStore } from '@shared/store/base-store';
import { initialBaseState } from '@shared/store/initial-base-state.function';
import { storeEvent } from '@shared/store/store-event.decorator';

export interface AuthState extends IBaseState {
    accessToken: string | null;
    refreshToken: string | null;
    loggedUser: UserDto | null;
}

const createInitialState = (): AuthState => (
    {
        ...initialBaseState(),
        accessToken : null,
        refreshToken: null,
        loggedUser  : null
    }
);

@Injectable()
@StoreConfig( { name: 'auth' } )
export class AuthStore extends BaseStore<AuthState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'Login successful' )
    onLogin(data: LoginResponseDto): void {
        this.update( {
                         accessToken : data.accessToken,
                         refreshToken: data.refreshToken,
                         loggedUser  : data.user
                     } );
    }

    @storeEvent( 'Logout successful' )
    onLogout(): void {
        this.update( createInitialState() );
    }
}
