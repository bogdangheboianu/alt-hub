import { Injectable } from '@angular/core';
import { CompanyActions } from '@company/data/company.actions';
import { CompanySelectors } from '@company/data/company.selectors';
import { CompanyDto } from '@dtos/company-dto';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';

@Injectable()
export class CompanyDetailsDataService extends DetailsComponentDataService<CompanyDto, {}> {
    constructor(
        private readonly companyActions: CompanyActions,
        private readonly companySelectors: CompanySelectors
    ) {
        super( companySelectors );
    }

    override onInit(): void {
        this.loadCompany();
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }

    private loadCompany(): void {
        this.companyActions.loadCompany();
    }
}
