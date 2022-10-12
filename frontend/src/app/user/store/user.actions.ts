import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { ConfirmUserDto } from '@dtos/confirm-user.dto';
import { CreateUserDto } from '@dtos/create-user.dto';
import { GetAllUsersParamsDto } from '@dtos/get-all-users-params.dto';
import { UpdateEmployeeInfoDto } from '@dtos/update-employee-info.dto';
import { UpdatePersonalInfoDto } from '@dtos/update-personal-info.dto';
import { UserService } from '@user/services/user.service';
import { UserSelectors } from '@user/store/user.selectors';
import { UserStore } from '@user/store/user.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserActions {
    constructor(
        private userService: UserService,
        private userStore: UserStore,
        private userSelectors: UserSelectors
    ) {
    }

    @action( 'Load all users' )
    loadAllUsers(params?: GetAllUsersParamsDto): void {
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

    @action( 'Activate user' )
    activateUser(userId: string): void {
        firstValueFrom( this.userService.activateUser( userId ) )
            .then();
    }

    @action( 'Confirm user' )
    confirmUser(data: ConfirmUserDto): void {
        firstValueFrom( this.userService.confirmUser( data ) )
            .then();
    }

    @action( 'Update user personal info' )
    updateUserPersonalInfo(userId: string, data: UpdatePersonalInfoDto): void {
        firstValueFrom( this.userService.updateUserPersonalInfo( userId, data ) )
            .then();
    }

    @action( 'Update user employee info' )
    updateUserEmployeeInfo(userId: string, data: UpdateEmployeeInfoDto): void {
        firstValueFrom( this.userService.updateUserEmployeeInfo( userId, data ) )
            .then();
    }
}
