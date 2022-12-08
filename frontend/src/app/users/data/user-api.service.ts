import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivateUserDto } from '@dtos/activate-user-dto';
import { CreateUserDto } from '@dtos/create-user-dto';
import { GetAllUsersParamsDto } from '@dtos/get-all-users-params-dto';
import { UpdateUserEmploymentInfoDto } from '@dtos/update-user-employment-info-dto';
import { UpdateUserPersonalInfoDto } from '@dtos/update-user-personal-info-dto';
import { UserDto } from '@dtos/user-dto';
import { ApiResult } from '@shared/api/api-result';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiService } from '@shared/api/api.service';
import { UserStore } from '@users/data/user.store';
import { Observable } from 'rxjs';

@Injectable()
export class UserApiService extends ApiService {
    constructor(private userStore: UserStore) {
        super( userStore );
    }

    getAllUsers(params?: GetAllUsersParamsDto): Observable<ApiResult<UserDto[]>> {
        const queryParams = new HttpParams()
            .appendAll( {
                            statuses: params?.statuses?.join( ',' ) ?? []
                        } );
        return this.getWithParams( apiRoutes.users.base, queryParams, this.userStore.onUserListLoaded.bind( this.userStore ) );
    }

    getUserById(id: string): Observable<ApiResult<UserDto>> {
        return this.get( `${ apiRoutes.users.base }/${ id }`, this.userStore.onUserLoaded.bind( this.userStore ) );
    }

    createUser(data: CreateUserDto): Observable<ApiResult<UserDto>> {
        return this.post( apiRoutes.users.base, data, this.userStore.onUserCreated.bind( this.userStore ) );
    }

    inviteUser(userId: string): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users.base }/${ userId }/invite`, {}, this.userStore.onUserInvited.bind( this.userStore ) );
    }

    reactivateUser(userId: string): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users.base }/${ userId }/reactivate`, {}, this.userStore.onUserReactivated.bind( this.userStore ) );
    }

    activateUser(data: ActivateUserDto): Observable<ApiResult<void>> {
        return this.patch( apiRoutes.users.activateUser, data, this.userStore.onUserActivated.bind( this.userStore ) );
    }

    updateUserPersonalInfo(userId: string, data: UpdateUserPersonalInfoDto): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users.base }/${ userId }/personal-info`, data, this.userStore.onUserPersonalInfoUpdated.bind( this.userStore ) );
    }

    updateUserEmploymentInfo(userId: string, data: UpdateUserEmploymentInfoDto): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users.base }/${ userId }/employment-info`, data, this.userStore.onUserEmploymentInfoUpdated.bind( this.userStore ) );
    }

    deactivateUser(userId: string): Observable<ApiResult<UserDto>> {
        return this.patch( `${ apiRoutes.users.base }/${ userId }/deactivate`, {}, this.userStore.onUserDeactivated.bind( this.userStore ) );
    }
}
