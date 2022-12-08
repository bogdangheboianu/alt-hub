import { Injectable } from '@angular/core';
import { UserDto } from '@dtos/user-dto';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';

@Injectable()
export class UserDetailsDataService extends DetailsComponentDataService<UserDto, {}> {
    constructor(
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors
    ) {
        super( userSelectors );
    }

    reactivateUser(): void {
        this.entity.then( user => this.userActions.reactivateUser( user.id ) );
    }

    deactivateUser(): void {
        this.entity.then( user => this.userActions.deactivateUser( user.id ) );
    }

    protected override onInit(): void {
        this.loadUser();
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }

    private loadUser(): void {
        this.getIdFromRoute()
            .subscribe( id => this.userActions.loadUserById( id ) );
    }
}
