import { Injectable } from '@angular/core';
import { CompanyActions } from '@company/data/company.actions';
import { CompanySelectors } from '@company/data/company.selectors';
import { CreateUserDto } from '@dtos/create-user-dto';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';

interface UserCreateComponentData {
    companyPositionOptions: SelectInputOptions;
    companyPositionOptionsLoading: boolean;
}

@Injectable()
export class UserCreateDataService extends BaseComponentDataService<UserCreateComponentData> {
    constructor(
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors,
        private readonly companyActions: CompanyActions,
        private readonly companySelectors: CompanySelectors
    ) {
        super( userSelectors );
    }

    create(data: CreateUserDto): void {
        this.userActions.createUser( data );
    }

    protected override onInit(): void {
        this.loadCompany();
    }

    protected override dataSource(): ComponentDataSource<UserCreateComponentData> {
        return {
            companyPositionOptions       : this.companySelectors.selectCompanyPositionsAsSelectInputOptions(),
            companyPositionOptionsLoading: this.companySelectors.selectLoading()
        };
    }

    private loadCompany(): void {
        this.companyActions.loadCompany();
    }
}
