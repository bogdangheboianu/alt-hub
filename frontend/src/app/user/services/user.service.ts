import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiRoutes } from '@shared/constants/api.routes';
import { ApiResult } from '@shared/models/api-result';
import { ApiService } from '@shared/services/api.service';
import { ConfirmUserDto } from '@dtos/confirm-user.dto';
import { CreateUserDto } from '@dtos/create-user.dto';
import { GetAllUsersParamsDto } from '@dtos/get-all-users-params.dto';
import { UpdateEmployeeInfoDto } from '@dtos/update-employee-info.dto';
import { UpdatePersonalInfoDto } from '@dtos/update-personal-info.dto';
import { UserDto } from '@dtos/user.dto';
import { UserStore } from '@user/store/user.store';
import { Observable } from 'rxjs';

@Injectable()
export class UserService extends ApiService {
    constructor(private userStore: UserStore) {
        super( userStore );
    }

    getAllUsers(params?: GetAllUsersParamsDto): Observable<ApiResult<UserDto[]>> {
        const queryParams = new HttpParams()
            .appendAll( {
                            statuses: params?.statuses?.join( ',' ) ?? []
                        } );
        return this.getWithParams( apiRoutes.users, queryParams, this.userStore.onUserListLoaded.bind( this.userStore ) );
    }

    getUserById(id: string): Observable<ApiResult<UserDto>> {
        return this.get( `${ apiRoutes.users }/${ id }`, this.userStore.onUserLoaded.bind( this.userStore ) );
    }

    createUser(data: CreateUserDto): Observable<ApiResult<UserDto>> {
        return this.post( apiRoutes.users, data, this.userStore.onUserCreated.bind( this.userStore ) );
    }

    inviteUser(userId: string): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users }/${ userId }/invite`, {}, this.userStore.onUserInvited.bind( this.userStore ) );
    }

    activateUser(userId: string): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users }/${ userId }/activate`, {}, this.userStore.onUserActivated.bind( this.userStore ) );
    }

    confirmUser(data: ConfirmUserDto): Observable<ApiResult<void>> {
        return this.patch( apiRoutes.confirmUser, data, this.userStore.onUserConfirmed.bind( this.userStore ) );
    }

    updateUserPersonalInfo(userId: string, data: UpdatePersonalInfoDto): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users }/${ userId }/personal-info`, data, this.userStore.onUserPersonalInfoUpdated.bind( this.userStore ) );
    }

    updateUserEmployeeInfo(userId: string, data: UpdateEmployeeInfoDto): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users }/${ userId }/employee-info`, data, this.userStore.onUserEmployeeInfoUpdated.bind( this.userStore ) );
    }
}
