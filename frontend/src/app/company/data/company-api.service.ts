import { Injectable } from '@angular/core';
import { CompanyStore } from '@company/data/company.store';
import { CompanyDto } from '@dtos/company-dto';
import { CompanyPositionDto } from '@dtos/company-position-dto';
import { CompanyPricingProfileDto } from '@dtos/company-pricing-profile-dto';
import { CreateCompanyPositionDto } from '@dtos/create-company-position-dto';
import { CreateCompanyPricingProfileDto } from '@dtos/create-company-pricing-profile-dto';
import { ApiResult } from '@shared/api/api-result';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiService } from '@shared/api/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyApiService extends ApiService {
    constructor(private readonly companyStore: CompanyStore) {
        super( companyStore );
    }

    getCompany(): Observable<ApiResult<CompanyDto>> {
        return this.get( apiRoutes.company.base, this.companyStore.onCompanyLoaded.bind( this.companyStore ) );
    }

    createCompanyPosition(data: CreateCompanyPositionDto): Observable<ApiResult<CompanyPositionDto>> {
        return this.post( apiRoutes.company.positions, data, this.companyStore.onCompanyPositionCreated.bind( this.companyStore ) );
    }

    createCompanyPricingProfile(data: CreateCompanyPricingProfileDto): Observable<ApiResult<CompanyPricingProfileDto>> {
        return this.post( apiRoutes.company.pricingProfiles, data, this.companyStore.onCompanyPricingProfileCreated.bind( this.companyStore ) );
    }
}
