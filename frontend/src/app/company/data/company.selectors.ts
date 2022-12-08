import { Injectable } from '@angular/core';
import { companyPositionsToSelectInputOptions, companyPricingProfilesToSelectInputOptions } from '@company/config/company.mappers';
import { CompanyState, CompanyStore } from '@company/data/company.store';
import { BaseEntitySelector } from '@config/store/store.models';
import { CompanyDto } from '@dtos/company-dto';
import { CompanyPositionDto } from '@dtos/company-position-dto';
import { CompanyPricingProfileDto } from '@dtos/company-pricing-profile-dto';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { map, Observable } from 'rxjs';

@Injectable()
export class CompanySelectors extends BaseEntitySelector<CompanyDto, CompanyState> {
    constructor(private companyStore: CompanyStore) {
        super( companyStore );
    }

    selectCompany(): Observable<CompanyDto | undefined> {
        return this.selectActive();
    }

    selectCompanyPositions(): Observable<CompanyPositionDto[]> {
        return this.select( state => state.activeCompanyPositions );
    }

    selectPricingProfiles(): Observable<CompanyPricingProfileDto[]> {
        return this.select( state => state.activeCompanyPricingProfiles );
    }

    selectCompanyPositionsAsSelectInputOptions(): Observable<SelectInputOptions> {
        return this.selectCompanyPositions()
                   .pipe( map( companyPositionsToSelectInputOptions ) );
    }

    selectCompanyPricingProfilesAsSelectInputOptions(): Observable<SelectInputOptions> {
        return this.selectPricingProfiles()
                   .pipe( map( companyPricingProfilesToSelectInputOptions ) );
    }
}
