import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { storeEvent } from '@config/store/store.decorators';
import { initialBaseEntityState } from '@config/store/store.functions';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { StoreConfig } from '@datorama/akita';
import { CompanyDto } from '@dtos/company-dto';
import { CompanyPositionDto } from '@dtos/company-position-dto';
import { CompanyPricingProfileDto } from '@dtos/company-pricing-profile-dto';
import { produce } from 'immer';

export interface CompanyState extends IBaseEntityState<CompanyDto> {
    activeCompanyPositions: CompanyPositionDto[];
    activeCompanyPricingProfiles: CompanyPricingProfileDto[];
}

const createInitialState = (): CompanyState => (
    {
        ...initialBaseEntityState(),
        activeCompanyPositions      : [],
        activeCompanyPricingProfiles: []
    }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Company, producerFn: produce } )
export class CompanyStore extends BaseEntityStore<CompanyDto, CompanyState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'Company loaded' )
    onCompanyLoaded(company: CompanyDto): void {
        this.upsert( company.id, company );
        this.setActive( company.id );
        this.update( state => {
            state.activeCompanyPositions = company.positions;
            state.activeCompanyPricingProfiles = company.pricingProfiles;
        } );
    }

    @storeEvent( 'Company position created' )
    onCompanyPositionCreated(companyPosition: CompanyPositionDto): void {
        this.update( state => {
            state.activeCompanyPositions = [ ...state.activeCompanyPositions, companyPosition ];
        } );
    }

    @storeEvent( 'Company pricing profile created' )
    onCompanyPricingProfileCreated(pricingProfile: CompanyPricingProfileDto): void {
        this.update( state => {
            state.activeCompanyPricingProfiles = [ ...state.activeCompanyPricingProfiles, pricingProfile ];
        } );
    }
}
