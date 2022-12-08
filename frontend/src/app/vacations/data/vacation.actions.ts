import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { CreateVacationRequestDto } from '@dtos/create-vacation-request-dto';
import { GetAllVacationsParamsDto } from '@dtos/get-all-vacations-params-dto';
import { UpdateVacationRequestDto } from '@dtos/update-vacation-request-dto';
import { VacationApiService } from '../data/vacation-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VacationActions {
    constructor(private vacationApiService: VacationApiService) {
    }

    @action( 'Load all vacations' )
    loadAllVacations(params?: GetAllVacationsParamsDto): void {
        firstValueFrom( this.vacationApiService.getAllVacations( params ) )
            .then();
    }

    @action( 'Create vacation request' )
    createVacationRequest(data: CreateVacationRequestDto): void {
        firstValueFrom( this.vacationApiService.createVacationRequest( data ) )
            .then();
    }

    @action( 'Update vacation request' )
    updateVacationRequest(id: string, data: UpdateVacationRequestDto): void {
        firstValueFrom( this.vacationApiService.updateVacationRequest( id, data ) )
            .then();
    }

    @action( 'Cancel vacation request' )
    cancelVacationRequest(id: string): void {
        firstValueFrom( this.vacationApiService.cancelVacationRequest( id ) )
            .then();
    }
}
