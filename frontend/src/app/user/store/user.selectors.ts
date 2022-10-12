import { Injectable } from '@angular/core';
import { CreateUserDto } from '@dtos/create-user.dto';
import { UserDto } from '@dtos/user.dto';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { BaseEntitySelector } from '@shared/store/base-entity-selector';
import { ICreateEmployeeInfo } from '@user/interfaces/create-employee-info.interface';
import { ICreatePersonalInfo } from '@user/interfaces/create-personal-info.interface';
import { ICreateUserAccount } from '@user/interfaces/create-user-account.interface';
import { UserState, UserStore } from '@user/store/user.store';
import { map, Observable, zip } from 'rxjs';

@Injectable()
export class UserSelectors extends BaseEntitySelector<UserDto, UserState> {
    constructor(protected readonly userStore: UserStore) {
        super( userStore );
    }

    selectNewUserAccount(): Observable<ICreateUserAccount | null> {
        return this.select( state => state.newUser.account );
    }

    selectNewUserPersonalInfo(): Observable<ICreatePersonalInfo | null> {
        return this.select( state => state.newUser.personalInfo );
    }

    selectNewUserEmployeeInfo(): Observable<ICreateEmployeeInfo | null> {
        return this.select( state => state.newUser.employeeInfo );
    }

    selectNewUserData(): Observable<CreateUserDto | null> {
        return zip( this.selectNewUserAccount(), this.selectNewUserPersonalInfo(), this.selectNewUserEmployeeInfo() )
            .pipe(
                map( ([ account, personalInfo, employeeInfo ]) => {
                    if( valueIsEmpty( account ) || valueIsEmpty( personalInfo ) || valueIsEmpty( employeeInfo ) ) {
                        return null;
                    }

                    return {
                        personalInfo: {
                            email: account.email,
                            ...personalInfo
                        },
                        employeeInfo,
                        isAdmin     : account.isAdmin,
                        password    : account.password
                    } as CreateUserDto;
                } )
            );
    }
}
