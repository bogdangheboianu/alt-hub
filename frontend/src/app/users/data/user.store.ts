import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { storeEvent } from '@config/store/store.decorators';
import { initialBaseEntityState } from '@config/store/store.functions';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { StoreConfig } from '@datorama/akita';
import { UserDto } from '@dtos/user-dto';
import { produce } from 'immer';

export interface UserState extends IBaseEntityState<UserDto> {
}

const createInitialState = (): UserState => (
    {
        ...initialBaseEntityState()
    }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Users, producerFn: produce } )
export class UserStore extends BaseEntityStore<UserDto, UserState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'User list loaded' )
    onUserListLoaded(userList: UserDto[]): void {
        this.set( userList );
    }

    @storeEvent( 'User loaded' )
    onUserLoaded(user: UserDto): void {
        this.upsert( user.id, user );
        this.setActive( user.id );
    }

    @storeEvent( 'User created' )
    onUserCreated(user: UserDto): void {
        this.add( user );
        this.setActive( user.id );
    }

    @storeEvent( 'User invited' )
    onUserInvited(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    }

    @storeEvent( 'User activated' )
    onUserReactivated(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    }

    @storeEvent( 'User activated' )
    onUserActivated(): void {
        //    Empty function used for event logging purposes
    }

    @storeEvent( 'User deactivated' )
    onUserDeactivated(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    };

    @storeEvent( 'User personal info updated' )
    onUserPersonalInfoUpdated(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    }

    @storeEvent( 'User employment info updated' )
    onUserEmploymentInfoUpdated(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    }
}
