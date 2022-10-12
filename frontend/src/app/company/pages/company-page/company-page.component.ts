import { Component, OnInit } from '@angular/core';
import { CompanyActions } from '@company/store/company.actions';
import { CompanySelectors } from '@company/store/company.selectors';
import { CompanyDto } from '@dtos/company.dto';
import { Observable } from 'rxjs';

@Component( {
                selector   : 'app-company-page',
                templateUrl: './company-page.component.html',
                styleUrls  : [ './company-page.component.scss' ]
            } )
export class CompanyPageComponent implements OnInit {
    company$!: Observable<CompanyDto | null>;

    constructor(
        private companyActions: CompanyActions,
        private companySelectors: CompanySelectors
    ) {
    }

    ngOnInit(): void {
        this.companyActions.loadCompany();
        this.company$ = this.companySelectors.selectCompany();
    }
}
