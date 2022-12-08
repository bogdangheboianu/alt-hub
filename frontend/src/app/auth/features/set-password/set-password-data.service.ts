import { Injectable } from '@angular/core';
import { ActivateUserDto } from '@dtos/activate-user-dto';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';

@Injectable()
export class SetPasswordDataService extends BaseComponentDataService<{}> {
    constructor(
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors
    ) {
        super( userSelectors );
    }

    override onInit(): void {
    }

    activateUser(data: ActivateUserDto): void {
        this.userActions.activateUser( data );
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }
}
