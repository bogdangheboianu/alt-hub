import { Injectable } from '@angular/core';
import { UserDto } from '@dtos/user-dto';
import { UserStatusEnum } from '@dtos/user-status-enum';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { ListComponentDataService } from '@shared/data/list-component-data.service';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';

@Injectable()
export class UserListDataService extends ListComponentDataService<UserDto, {}> {
    constructor(
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors
    ) {
        super( userSelectors );
    }

    loadUsers(statuses: UserStatusEnum[]) {
        this.userActions.loadAllUsers( { statuses } );
    }

    protected override onInit(): void {
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }
}
