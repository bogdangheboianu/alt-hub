import { Injectable } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { AnnualEmployeeSheetDto } from '@dtos/annual-employee-sheet-dto';
import { UserDto } from '@dtos/user-dto';
import { FiscalActions } from '@fiscal/data/fiscal.actions';
import { FiscalSelectors } from '@fiscal/data/fiscal.selectors';
import { takeIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { onlyDate } from '@shared/config/functions/date.functions';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { UserSelectors } from '@users/data/user.selectors';
import { VacationsByTimePeriod } from '@vacations/config/vacation.interfaces';
import { CreateVacationRequest, UpdateVacationRequest } from '@vacations/config/vacation.types';
import { VacationActions } from '@vacations/data/vacation.actions';
import { VacationSelectors } from '@vacations/data/vacation.selectors';
import { takeUntilDestroy } from 'ngx-reactivetoolkit';

interface UserVacationsComponentData {
    currentAnnualEmployeeSheet: AnnualEmployeeSheetDto;
    currentAnnualEmployeeSheetLoading: boolean;
    loggedUser: UserDto;
    vacationsByTimePeriod: VacationsByTimePeriod;
    vacationsLoading: boolean;
    vacationsSuccess: boolean;
}

@Injectable()
export class UserVacationsDataService extends DetailsComponentDataService<UserDto, UserVacationsComponentData> {
    constructor(
        private readonly userSelectors: UserSelectors,
        private readonly fiscalSelectors: FiscalSelectors,
        private readonly fiscalActions: FiscalActions,
        private readonly authSelectors: AuthSelectors,
        private readonly vacationActions: VacationActions,
        private readonly vacationSelectors: VacationSelectors
    ) {
        super( userSelectors );
    }

    loadCurrentAnnualEmployeeSheet(): void {
        this.entity.then( user => this.fiscalActions.loadCurrentAnnualEmployeeSheet( user.id ) );
    }

    loadVacations(): void {
        this.source!.currentAnnualEmployeeSheet
                    .pipe( takeUntilDestroy( this.componentInstance ), takeIfDefined )
                    .subscribe( sheet => this.vacationActions.loadAllVacations( { annualEmployeeSheetId: sheet.id } ) );
    }

    createVacation(data: CreateVacationRequest): void {
        const { fromDate, toDate } = data.dateInterval;
        this.vacationActions.createVacationRequest( {
                                                        ...data,
                                                        fromDate: onlyDate( fromDate ),
                                                        toDate  : onlyDate( toDate )
                                                    }
        );
    }

    updateVacation(id: string, data: UpdateVacationRequest): void {
        const { fromDate, toDate } = data.dateInterval;
        this.vacationActions.updateVacationRequest( id, {
                                                        ...data,
                                                        fromDate: onlyDate( fromDate ),
                                                        toDate  : onlyDate( toDate )
                                                    }
        );
    }

    cancelVacation(id: string): void {
        this.vacationActions.cancelVacationRequest( id );
    }

    protected override onInit(): void {
        this.loadCurrentAnnualEmployeeSheet();
        this.loadVacations();
    }

    protected override dataSource(): ComponentDataSource<UserVacationsComponentData> {
        return {
            currentAnnualEmployeeSheet       : this.fiscalSelectors.selectCurrentAnnualEmployeeSheet()
                                                   .pipe( takeIfDefined ),
            currentAnnualEmployeeSheetLoading: this.fiscalSelectors.selectLoading(),
            loggedUser                       : this.authSelectors.selectLoggedUser()
                                                   .pipe( takeIfDefined ),
            vacationsByTimePeriod            : this.vacationSelectors.selectVacationsGroupedByTimePeriod(),
            vacationsLoading                 : this.vacationSelectors.selectLoading(),
            vacationsSuccess                 : this.vacationSelectors.selectSuccess()
        };
    }
}
