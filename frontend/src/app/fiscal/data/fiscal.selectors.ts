import { Injectable } from '@angular/core';
import { AnnualEmployeeSheetDto } from '@dtos/annual-employee-sheet-dto';
import { FiscalYearDto } from '@dtos/fiscal-year-dto';
import { FiscalState, FiscalStore } from '@fiscal/data/fiscal.store';
import { BaseSelector } from '@config/store/store.models';
import { Observable } from 'rxjs';

@Injectable()
export class FiscalSelectors extends BaseSelector<FiscalState> {
    constructor(private fiscalStore: FiscalStore) {
        super( fiscalStore );
    }

    selectCurrentFiscalYear(): Observable<FiscalYearDto | null> {
        return this.select( state => state.currentFiscalYear );
    }

    selectCurrentAnnualEmployeeSheet(): Observable<AnnualEmployeeSheetDto | null> {
        return this.select( state => state.currentAnnualEmployeeSheet );
    }
}
