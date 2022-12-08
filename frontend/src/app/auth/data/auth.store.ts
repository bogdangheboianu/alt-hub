import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { storeEvent } from '@config/store/store.decorators';
import { initialBaseState } from '@config/store/store.functions';
import { IBaseState } from '@config/store/store.interfaces';
import { BaseStore } from '@config/store/store.models';
import { StoreConfig } from '@datorama/akita';
import { LoginResponseDto } from '@dtos/login-response-dto';
import { UserDto } from '@dtos/user-dto';

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
@StoreConfig( { name: StoreNameEnum.Auth } )
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
