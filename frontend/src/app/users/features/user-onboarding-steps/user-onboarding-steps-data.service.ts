import { Injectable } from '@angular/core';
import { UserDto } from '@dtos/user-dto';
import { UserStatusEnum } from '@dtos/user-status-enum';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';
import { map, Observable } from 'rxjs';

@Injectable()
export class UserOnboardingStepsDataService extends DetailsComponentDataService<UserDto, {}> {
    constructor(
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors
    ) {
        super( userSelectors );
    }

    inviteUser(): void {
        this.entity.then( user => this.userActions.inviteUser( user.id ) );
    }

    userIsOnboarding(): Observable<boolean> {
        return this.entity$.pipe(
            map( user => [ UserStatusEnum.Created, UserStatusEnum.Invited ].includes( user.account.status ) )
        );
    }

    protected override onInit(): void {
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }
}
