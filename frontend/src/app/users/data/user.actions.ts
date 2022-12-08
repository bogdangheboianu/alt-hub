import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { ActivateUserDto } from '@dtos/activate-user-dto';
import { CreateUserDto } from '@dtos/create-user-dto';
import { GetAllUsersParamsDto } from '@dtos/get-all-users-params-dto';
import { UpdateUserEmploymentInfoDto } from '@dtos/update-user-employment-info-dto';
import { UpdateUserPersonalInfoDto } from '@dtos/update-user-personal-info-dto';
import { UserApiService } from '@users/data/user-api.service';
import { UserSelectors } from '@users/data/user.selectors';
import { UserStore } from '@users/data/user.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserActions {
    constructor(
        private userService: UserApiService,
        private userStore: UserStore,
        private userSelectors: UserSelectors
    ) {
    }

    @action( 'Load all users' )
    loadAllUsers(params?: GetAllUsersParamsDto): void {
        this.userStore.set( [] );
        firstValueFrom( this.userService.getAllUsers( params ) )
            .then();
    }

    @action( 'Load user by id' )
    loadUserById(id: string): void {
        if( this.userSelectors.hasEntity( id ) ) {
            return this.userStore.setActive( id );
        }

        firstValueFrom( this.userService.getUserById( id ) )
            .then();
    }

    @action( 'Create user' )
    createUser(data: CreateUserDto): void {
        firstValueFrom( this.userService.createUser( data ) )
            .then();
    }

    @action( 'Invite user' )
    inviteUser(userId: string): void {
        firstValueFrom( this.userService.inviteUser( userId ) )
            .then();
    }

    @action( 'Reactivate user' )
    reactivateUser(userId: string): void {
        firstValueFrom( this.userService.reactivateUser( userId ) )
            .then();
    }

    @action( 'Activate user' )
    activateUser(data: ActivateUserDto): void {
        firstValueFrom( this.userService.activateUser( data ) )
            .then();
    }

    @action( 'Update user personal info' )
    updateUserPersonalInfo(userId: string, data: UpdateUserPersonalInfoDto): void {
        firstValueFrom( this.userService.updateUserPersonalInfo( userId, data ) )
            .then();
    }

    @action( 'Update user employment info' )
    updateUserEmploymentInfo(userId: string, data: UpdateUserEmploymentInfoDto): void {
        firstValueFrom( this.userService.updateUserEmploymentInfo( userId, data ) )
            .then();
    }

    @action( 'Deactivate user' )
    deactivateUser(userId: string): void {
        firstValueFrom( this.userService.deactivateUser( userId ) )
            .then();
    }
}
