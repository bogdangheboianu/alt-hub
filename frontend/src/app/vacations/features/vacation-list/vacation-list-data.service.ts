import { Injectable } from '@angular/core';
import { FiscalYearDto } from '@dtos/fiscal-year-dto';
import { VacationDto } from '@dtos/vacation-dto';
import { FiscalActions } from '@fiscal/data/fiscal.actions';
import { FiscalSelectors } from '@fiscal/data/fiscal.selectors';
import { takeIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { ListComponentDataService } from '@shared/data/list-component-data.service';
import { VacationsByTimePeriod } from '@vacations/config/vacation.interfaces';
import { VacationActions } from '@vacations/data/vacation.actions';
import { VacationSelectors } from '@vacations/data/vacation.selectors';
import { takeUntilDestroy } from 'ngx-reactivetoolkit';

interface VacationListComponentData {
    currentFiscalYear: FiscalYearDto;
    currentFiscalYearLoading: boolean;
    vacationsByTimePeriod: VacationsByTimePeriod;
}

@Injectable()
export class VacationListDataService extends ListComponentDataService<VacationDto, VacationListComponentData> {
    constructor(
        private readonly vacationActions: VacationActions,
        private readonly vacationSelectors: VacationSelectors,
        private readonly fiscalActions: FiscalActions,
        private readonly fiscalSelectors: FiscalSelectors
    ) {
        super( vacationSelectors );
    }

    loadCurrentFiscalYear(): void {
        this.fiscalActions.loadCurrentFiscalYear();
    }

    loadVacations(): void {
        this.source!.currentFiscalYear
                    .pipe( takeUntilDestroy( this.componentInstance ) )
                    .subscribe( fiscalYear => this.vacationActions.loadAllVacations( { fiscalYearId: fiscalYear.id } ) );
    }

    protected override onInit(): void {
        this.loadCurrentFiscalYear();
        this.loadVacations();
    }

    protected override dataSource(): ComponentDataSource<VacationListComponentData> {
        return {
            currentFiscalYear       : this.fiscalSelectors.selectCurrentFiscalYear()
                                          .pipe( takeIfDefined ),
            currentFiscalYearLoading: this.fiscalSelectors.selectLoading(),
            vacationsByTimePeriod   : this.vacationSelectors.selectVacationsGroupedByTimePeriod()
        };
    }
}
