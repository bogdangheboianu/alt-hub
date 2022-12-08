import { Injectable } from '@angular/core';
import { CompanyApiService } from '@company/data/company-api.service';
import { CompanyStore } from '@company/data/company.store';
import { action } from '@datorama/akita';
import { CreateCompanyPositionDto } from '@dtos/create-company-position-dto';
import { CreateCompanyPricingProfileDto } from '@dtos/create-company-pricing-profile-dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CompanyActions {
    constructor(
        private readonly companyStore: CompanyStore,
        private readonly companyService: CompanyApiService
    ) {
    }

    @action( 'Load company' )
    loadCompany(): void {
        firstValueFrom( this.companyService.getCompany() )
            .then();
    }

    @action( 'Create company position' )
    createCompanyPosition(data: CreateCompanyPositionDto): void {
        firstValueFrom( this.companyService.createCompanyPosition( data ) )
            .then();
    }

    @action( 'Create company pricing profile' )
    createCompanyPricingProfile(data: CreateCompanyPricingProfileDto): void {
        firstValueFrom( this.companyService.createCompanyPricingProfile( data ) )
            .then();
    }
}
