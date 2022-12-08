import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { UpdateAnnualEmployeeSheetDto } from '@dtos/update-annual-employee-sheet-dto';
import { FiscalApiService } from '@fiscal/data/fiscal-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FiscalActions {
    constructor(private fiscalService: FiscalApiService) {
    }

    @action( 'Load current fiscal year' )
    loadCurrentFiscalYear(): void {
        firstValueFrom( this.fiscalService.getCurrentFiscalYear() )
            .then();
    }

    @action( 'Load current annual employee sheet' )
    loadCurrentAnnualEmployeeSheet(userId: string): void {
        firstValueFrom( this.fiscalService.getCurrentAnnualEmployeeSheet( userId ) )
            .then();
    }

    @action( 'Update annual employee sheet' )
    updateAnnualEmployeeSheet(id: string, data: UpdateAnnualEmployeeSheetDto): void {
        firstValueFrom( this.fiscalService.updateAnnualEmployeeSheet( id, data ) )
            .then();
    }
}
