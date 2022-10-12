import { Injectable } from '@angular/core';
import { CompanyService } from '@company/services/company.service';
import { CompanyStore } from '@company/store/company.store';
import { action } from '@datorama/akita';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CompanyActions {
    constructor(
        private readonly companyStore: CompanyStore,
        private readonly companyService: CompanyService
    ) {
    }

    @action( 'Load company' )
    loadCompany(): void {
        firstValueFrom( this.companyService.getCompany() )
            .then();
    }
}
