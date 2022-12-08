import { Injectable } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { CompanyActions } from '@company/data/company.actions';
import { CompanySelectors } from '@company/data/company.selectors';
import { AnnualEmployeeSheetDto } from '@dtos/annual-employee-sheet-dto';
import { UpdateAccountDto } from '@dtos/update-account-dto';
import { UpdateAnnualEmployeeSheetDto } from '@dtos/update-annual-employee-sheet-dto';
import { UpdateUserEmploymentInfoDto } from '@dtos/update-user-employment-info-dto';
import { UpdateUserPersonalInfoDto } from '@dtos/update-user-personal-info-dto';
import { UserDto } from '@dtos/user-dto';
import { FiscalActions } from '@fiscal/data/fiscal.actions';
import { FiscalSelectors } from '@fiscal/data/fiscal.selectors';
import { takeIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';
import { firstValueFrom } from 'rxjs';

interface UserInfoComponentData {
    companyPositionOptions: SelectInputOptions;
    companyPositionOptionsLoading: boolean;
    isAdmin: boolean;
    fiscalLoading: boolean;
    fiscalSuccess: boolean;
    userCurrentAnnualEmployeeSheet: AnnualEmployeeSheetDto;
}

@Injectable()
export class UserInfoDataService extends DetailsComponentDataService<UserDto, UserInfoComponentData> {
    constructor(
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors,
        private readonly companyActions: CompanyActions,
        private readonly companySelectors: CompanySelectors,
        private readonly authSelectors: AuthSelectors,
        private readonly fiscalActions: FiscalActions,
        private readonly fiscalSelectors: FiscalSelectors
    ) {
        super( userSelectors );
    }

    updateUserAccount(data: UpdateAccountDto): void {
        this.entity.then( user => {
        } );
    }

    updateUserPersonalInfo(data: UpdateUserPersonalInfoDto): void {
        this.entity.then( user => this.userActions.updateUserPersonalInfo( user.id, data ) );
    }

    updateUserEmploymentInfo(data: UpdateUserEmploymentInfoDto): void {
        this.entity.then( user => this.userActions.updateUserEmploymentInfo( user.id, data ) );
    }

    updateAnnualEmployeeSheet(data: UpdateAnnualEmployeeSheetDto): void {
        firstValueFrom( this.source!.userCurrentAnnualEmployeeSheet )
            .then( annualEmployeeSheet => this.fiscalActions.updateAnnualEmployeeSheet( annualEmployeeSheet.id, data ) );
    }

    protected override onInit(): void {
        this.loadCompany();
        this.loadCurrentAnnualEmployeeSheet();
    }

    protected override dataSource(): ComponentDataSource<UserInfoComponentData> {
        return {
            companyPositionOptions        : this.companySelectors.selectCompanyPositionsAsSelectInputOptions(),
            companyPositionOptionsLoading : this.companySelectors.selectLoading(),
            isAdmin                       : this.authSelectors.isLoggedUserAdmin(),
            fiscalLoading                 : this.fiscalSelectors.selectLoading(),
            fiscalSuccess                 : this.fiscalSelectors.selectSuccess(),
            userCurrentAnnualEmployeeSheet: this.fiscalSelectors.selectCurrentAnnualEmployeeSheet()
                                                .pipe( takeIfDefined )
        };
    }

    private loadCompany(): void {
        this.companyActions.loadCompany();
    }

    private loadCurrentAnnualEmployeeSheet(): void {
        this.entity$.subscribe( user => this.fiscalActions.loadCurrentAnnualEmployeeSheet( user.id ) );
    }
}
