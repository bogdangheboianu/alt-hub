import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { storeEvent } from '@config/store/store.decorators';
import { initialBaseState } from '@config/store/store.functions';
import { IBaseState } from '@config/store/store.interfaces';
import { BaseStore } from '@config/store/store.models';
import { arrayUpsert, StoreConfig } from '@datorama/akita';
import { AnnualEmployeeSheetDto } from '@dtos/annual-employee-sheet-dto';
import { FiscalYearDto } from '@dtos/fiscal-year-dto';

export interface FiscalState extends IBaseState {
    fiscalYears: FiscalYearDto[];
    currentFiscalYear: FiscalYearDto | null;
    currentAnnualEmployeeSheet: AnnualEmployeeSheetDto | null;
}

const initialState = (): FiscalState => (
    {
        ...initialBaseState(),
        fiscalYears               : [],
        currentFiscalYear         : null,
        currentAnnualEmployeeSheet: null
    }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Fiscal } )
export class FiscalStore extends BaseStore<FiscalState> {
    constructor() {
        super( initialState() );
    }

    @storeEvent( 'Current fiscal year loaded' )
    onCurrentFiscalYearLoaded(fiscalYear: FiscalYearDto): void {
        this.update( state => (
            {
                fiscalYears      : arrayUpsert( state.fiscalYears, fiscalYear.id, fiscalYear, 'id' ),
                currentFiscalYear: fiscalYear
            }
        ) );
    }

    @storeEvent( 'Current annual employee sheet loaded' )
    onCurrentAnnualEmployeeSheetLoaded(currentAnnualEmployeeSheet: AnnualEmployeeSheetDto): void {
        this.update( { currentAnnualEmployeeSheet } );
    }

    @storeEvent( 'Annual employee sheet updated' )
    onAnnualEmployeeSheetUpdated(data: FiscalYearDto, annualEmployeeSheetId: string[]): void {
        this.update( state => (
            {
                ...state,
                fiscalYears               : arrayUpsert( state.fiscalYears, data.id, data, 'id' ),
                currentAnnualEmployeeSheet: data.annualEmployeeSheets.find( aes => aes.id === annualEmployeeSheetId[0] ) ?? null
            }
        ) );
    }
}
