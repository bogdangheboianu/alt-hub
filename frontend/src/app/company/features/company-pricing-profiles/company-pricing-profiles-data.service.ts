import { Injectable } from '@angular/core';
import { CompanyActions } from '@company/data/company.actions';
import { CompanySelectors } from '@company/data/company.selectors';
import { CompanyDto } from '@dtos/company-dto';
import { CompanyPricingProfileDto } from '@dtos/company-pricing-profile-dto';
import { CreateCompanyPricingProfileDto } from '@dtos/create-company-pricing-profile-dto';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';

interface CompanyPricingProfilesComponentData {
    pricingProfiles: CompanyPricingProfileDto[];
    positionsSelectInputOptions: SelectInputOptions;
}

@Injectable()
export class CompanyPricingProfilesDataService extends DetailsComponentDataService<CompanyDto, CompanyPricingProfilesComponentData> {
    constructor(
        private readonly companyActions: CompanyActions,
        private readonly companySelectors: CompanySelectors
    ) {
        super( companySelectors );
    }

    createCompanyPricingProfile(data: CreateCompanyPricingProfileDto): void {
        this.companyActions.createCompanyPricingProfile( data );
    }

    protected override onInit(): void {
    }

    protected override dataSource(): ComponentDataSource<CompanyPricingProfilesComponentData> {
        return {
            pricingProfiles            : this.companySelectors.selectPricingProfiles(),
            positionsSelectInputOptions: this.companySelectors.selectCompanyPositionsAsSelectInputOptions()
        };
    }
}
