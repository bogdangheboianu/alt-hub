import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { CompanyDto } from '@dtos/company.dto';
import { IBaseState } from '@shared/store/base-state.interface';
import { BaseStore } from '@shared/store/base-store';
import { initialBaseState } from '@shared/store/initial-base-state.function';
import { storeEvent } from '@shared/store/store-event.decorator';

export interface CompanyState extends IBaseState {
    company: CompanyDto | null;
}

const createInitialState = (): CompanyState => (
    {
        ...initialBaseState(),
        company: null
    }
);

@Injectable()
@StoreConfig( { name: 'company' } )
export class CompanyStore extends BaseStore<CompanyState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'Company loaded' )
    onCompanyLoaded(company: CompanyDto): void {
        this.update( { company } );
    }
}
