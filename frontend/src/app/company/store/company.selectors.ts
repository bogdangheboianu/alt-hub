import { Injectable } from '@angular/core';
import { CompanyState, CompanyStore } from '@company/store/company.store';
import { CompanyPositionDto } from '@dtos/company-position.dto';
import { CompanyDto } from '@dtos/company.dto';
import { BaseSelector } from '@shared/store/base-selector';
import { Observable } from 'rxjs';

@Injectable()
export class CompanySelectors extends BaseSelector<CompanyState> {
    constructor(private companyStore: CompanyStore) {
        super( companyStore );
    }

    selectCompany(): Observable<CompanyDto | null> {
        return this.select( 'company' );
    }

    selectCompanyPositions(): Observable<CompanyPositionDto[]> {
        return this.select( state => state.company?.positions ?? [] );
    }
}
