import { Injectable } from '@angular/core';
import { apiRoutes } from '@shared/constants/api.routes';
import { ApiResult } from '@shared/models/api-result';
import { ApiService } from '@shared/services/api.service';
import { CompanyStore } from '@company/store/company.store';
import { CompanyDto } from '@dtos/company.dto';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyService extends ApiService {
    constructor(private readonly companyStore: CompanyStore) {
        super( companyStore );
    }

    getCompany(): Observable<ApiResult<CompanyDto>> {
        return this.get( apiRoutes.company, this.companyStore.onCompanyLoaded.bind( this.companyStore ) );
    }
}
