import { Injectable } from '@angular/core';
import { AuthActions } from '@auth/data/auth.actions';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { LoginWithCredentialsDto } from '@dtos/login-with-credentials-dto';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';

@Injectable()
export class LoginDataService extends BaseComponentDataService<{}> {
    constructor(
        private readonly authActions: AuthActions,
        private readonly authSelectors: AuthSelectors
    ) {
        super( authSelectors );
    }

    override onInit(): void {
    }

    login(data: LoginWithCredentialsDto): void {
        this.authActions.login( data );
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }
}
