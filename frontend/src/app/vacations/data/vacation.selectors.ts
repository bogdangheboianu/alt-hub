import { Injectable } from '@angular/core';
import { VacationDto } from '@dtos/vacation-dto';
import { VacationStatusEnum } from '@dtos/vacation-status-enum';
import { isFutureDateInterval, isOngoingDateInterval, isPastDateInterval } from '@shared/config/functions/date.functions';
import { BaseEntitySelector } from '@config/store/store.models';
import { VacationsByTimePeriod } from '@vacations/config/vacation.interfaces';
import { VacationState, VacationStore } from '@vacations/data/vacation.store';
import { map, Observable } from 'rxjs';

@Injectable()
export class VacationSelectors extends BaseEntitySelector<VacationDto, VacationState> {
    constructor(private vacationStore: VacationStore) {
        super( vacationStore );
    }

    selectVacationsGroupedByTimePeriod(): Observable<VacationsByTimePeriod> {
        return this.selectAll()
                   .pipe(
                       map( vacations => {
                           const vacationLists: VacationsByTimePeriod = {
                               past   : [],
                               ongoing: [],
                               future : []
                           };

                           vacations.filter( v => v.status === VacationStatusEnum.Approved )
                                    .forEach( v => {
                                        const { fromDate, toDate } = v;

                                        if( isPastDateInterval( fromDate, toDate ) ) {
                                            vacationLists.past.push( v );
                                        }

                                        if( isOngoingDateInterval( fromDate, toDate ) ) {
                                            vacationLists.ongoing.push( v );
                                        }

                                        if( isFutureDateInterval( fromDate, toDate ) ) {
                                            vacationLists.future.push( v );
                                        }
                                    } );

                           return vacationLists;
                       } )
                   );
    }
}
