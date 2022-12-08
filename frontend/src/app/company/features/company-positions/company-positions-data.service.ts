import { Injectable } from '@angular/core';
import { CompanyActions } from '@company/data/company.actions';
import { CompanySelectors } from '@company/data/company.selectors';
import { CompanyPositionDto } from '@dtos/company-position-dto';
import { CreateCompanyPositionDto } from '@dtos/create-company-position-dto';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';
import { Observable } from 'rxjs';

interface CompanyPositionsComponentData {
    companyPositions: CompanyPositionDto[];
}

@Injectable()
export class CompanyPositionsDataService extends BaseComponentDataService<CompanyPositionsComponentData> {
    companyPositions$!: Observable<CompanyPositionDto[]>;

    constructor(
        private readonly companyActions: CompanyActions,
        private readonly companySelectors: CompanySelectors
    ) {
        super( companySelectors );
    }

    override onInit(): void {
    }

    createCompanyPosition(data: CreateCompanyPositionDto): void {
        this.companyActions.createCompanyPosition( data );
    }

    protected override dataSource(): ComponentDataSource<CompanyPositionsComponentData> {
        return {
            companyPositions: this.companySelectors.selectCompanyPositions()
        };
    }
}
