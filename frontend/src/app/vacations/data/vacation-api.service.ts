import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateVacationRequestDto } from '@dtos/create-vacation-request-dto';
import { GetAllVacationsParamsDto } from '@dtos/get-all-vacations-params-dto';
import { UpdateVacationRequestDto } from '@dtos/update-vacation-request-dto';
import { VacationDto } from '@dtos/vacation-dto';
import { ApiResult } from '@shared/api/api-result';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiService } from '@shared/api/api.service';
import { Observable } from 'rxjs';
import { VacationStore } from '../data/vacation.store';

@Injectable()
export class VacationApiService extends ApiService {
    constructor(private vacationStore: VacationStore) {
        super( vacationStore );
    }

    getAllVacations(params?: GetAllVacationsParamsDto): Observable<ApiResult<VacationDto[]>> {
        let queryParams = new HttpParams();

        if( params?.fiscalYearId ) {
            queryParams = queryParams.append( 'fiscalYearId', params.fiscalYearId );
        }

        if( params?.annualEmployeeSheetId ) {
            queryParams = queryParams.append( 'annualEmployeeSheetId', params.annualEmployeeSheetId );
        }

        return this.getWithParams( apiRoutes.vacations.base, queryParams, this.vacationStore.onVacationListLoaded.bind( this.vacationStore ) );
    }

    createVacationRequest(data: CreateVacationRequestDto): Observable<ApiResult<VacationDto>> {
        return this.post( apiRoutes.vacations.base, data, this.vacationStore.onVacationRequestCreated.bind( this.vacationStore ) );
    }

    updateVacationRequest(id: string, data: UpdateVacationRequestDto): Observable<ApiResult<VacationDto>> {
        return this.put( `${ apiRoutes.vacations.base }/${ id }`, data, this.vacationStore.onVacationRequestUpdated.bind( this.vacationStore ) );
    }

    cancelVacationRequest(id: string): Observable<ApiResult<VacationDto>> {
        return this.patch( `${ apiRoutes.vacations.base }/${ id }/cancel`, {}, this.vacationStore.onVacationRequestCanceled.bind( this.vacationStore ) );
    }
}
