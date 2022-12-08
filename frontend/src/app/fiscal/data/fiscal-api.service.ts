import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnnualEmployeeSheetDto } from '@dtos/annual-employee-sheet-dto';
import { FiscalYearDto } from '@dtos/fiscal-year-dto';
import { UpdateAnnualEmployeeSheetDto } from '@dtos/update-annual-employee-sheet-dto';
import { FiscalStore } from '@fiscal/data/fiscal.store';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiResult } from '@shared/api/api-result';
import { ApiService } from '@shared/api/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class FiscalApiService extends ApiService {
    constructor(private readonly fiscalStore: FiscalStore) {
        super( fiscalStore );
    }

    getCurrentFiscalYear(): Observable<ApiResult<FiscalYearDto>> {
        return this.get( apiRoutes.fiscal.currentYear, this.fiscalStore.onCurrentFiscalYearLoaded.bind( this.fiscalStore ) );
    }

    updateAnnualEmployeeSheet(id: string, data: UpdateAnnualEmployeeSheetDto): Observable<ApiResult<FiscalYearDto>> {
        return this.put( `${ apiRoutes.fiscal.currentYearAnnualEmployeeSheets }/${ id }`, data, this.fiscalStore.onAnnualEmployeeSheetUpdated.bind( this.fiscalStore ), id );
    }

    getCurrentAnnualEmployeeSheet(userId: string): Observable<ApiResult<AnnualEmployeeSheetDto>> {
        const params = new HttpParams().append( 'userId', userId );
        return this.getWithParams( apiRoutes.fiscal.currentAnnualEmployeeSheet, params, this.fiscalStore.onCurrentAnnualEmployeeSheetLoaded.bind( this.fiscalStore ) );
    }
}
