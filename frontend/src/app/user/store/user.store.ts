import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { UserDto } from '@dtos/user.dto';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';
import { BaseEntityStore } from '@shared/store/base-entity-store';
import { initialBaseEntityState } from '@shared/store/initial-base-entity-state.function';
import { storeEvent } from '@shared/store/store-event.decorator';
import { ICreateEmployeeInfo } from '@user/interfaces/create-employee-info.interface';
import { ICreatePersonalInfo } from '@user/interfaces/create-personal-info.interface';
import { ICreateUserAccount } from '@user/interfaces/create-user-account.interface';
import { produce } from 'immer';

export interface UserState extends IBaseEntityState<UserDto> {
    newUser: {
        account: ICreateUserAccount | null;
        personalInfo: ICreatePersonalInfo | null;
        employeeInfo: ICreateEmployeeInfo | null
    };
}

const createInitialState = (): UserState => (
    {
        ...initialBaseEntityState(),
        newUser: {
            account     : null,
            personalInfo: null,
            employeeInfo: null
        }
    }
);

@Injectable()
@StoreConfig( { name: 'users', producerFn: produce } )
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
        this.setActive( user.id );
        this.update( state => (
            {
                ...state,
                newUser: { ...createInitialState().newUser }
            }
        ) );
    }

    @storeEvent( 'User invited' )
    onUserInvited(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    }

    @storeEvent( 'User activated' )
    onUserActivated(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    }

    @storeEvent( 'User confirmed' )
    onUserConfirmed(): void {
        //    Empty function used for event logging purposes
    }

    @storeEvent( 'User personal info updated' )
    onUserPersonalInfoUpdated(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    }

    @storeEvent( 'User employee info updated' )
    onUserEmployeeInfoUpdated(user: UserDto): void {
        this.replace( user.id, user );
        this.setActive( user.id );
    }

    setNewUserAccount(account: ICreateUserAccount): void {
        this.update( state => (
            {
                ...state,
                newUser: { ...state.newUser, account }
            }
        ) );
    }

    setNewUserPersonalInfo(personalInfo: ICreatePersonalInfo): void {
        this.update( state => (
            {
                ...state,
                newUser: { ...state.newUser, personalInfo }
            }
        ) );
    }

    setNewUserEmployeeInfo(employeeInfo: ICreateEmployeeInfo): void {
        this.update( state => (
            {
                ...state,
                newUser: { ...state.newUser, employeeInfo }
            }
        ) );
    }

    resetNewUser(): void {
        this.update( state => (
            {
                ...state,
                newUser: { ...createInitialState().newUser }
            }
        ) );
    }
}
