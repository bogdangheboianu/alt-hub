import { Component, EventEmitter, Output } from '@angular/core';
import { UserStatusEnum } from '@dtos/user-status.enum';
import { UserDto } from '@dtos/user.dto';
import { takeIfDefined } from '@shared/custom-rxjs-operators';
import { UserSelectors } from '@user/store/user.selectors';
import { map, Observable } from 'rxjs';

@Component( {
                selector   : 'app-change-user-status-button',
                templateUrl: './change-user-status-button.component.html',
                styleUrls  : [ './change-user-status-button.component.scss' ]
            } )
export class ChangeUserStatusButtonComponent {
    @Output() onClick = new EventEmitter();

    constructor(
        private readonly userSelectors: UserSelectors
    ) {
    }

    get loadedUser(): Observable<UserDto> {
        return this.userSelectors.selectActive()
                   .pipe( takeIfDefined );
    }

    get userStatusUpdateIsLoading(): Observable<boolean> {
        return this.userSelectors.selectLoading();
    }

    get text(): Observable<string> {
        return this.loadedUser.pipe(
            map( user => {
                switch( user.status ) {
                    case UserStatusEnum.Created:
                        return 'Invite';
                    case UserStatusEnum.Invited:
                        return 'Awaiting confirmation';
                    case UserStatusEnum.Confirmed:
                        return 'Activate';
                    default:
                        return '';
                }
            } )
        );
    }

    get isDisabled(): Observable<boolean> {
        return this.loadedUser.pipe(
            map( user => [
                UserStatusEnum.Active,
                UserStatusEnum.Invited,
                UserStatusEnum.Inactive
            ].includes( user.status ) )
        );
    }
}
