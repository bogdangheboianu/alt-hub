import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { VacationDto } from '@dtos/vacation-dto';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { initialBaseEntityState } from '@config/store/store.functions';
import { storeEvent } from '@config/store/store.decorators';
import { StoreNameEnum } from '@config/store/store.constants';

export interface VacationState extends IBaseEntityState<VacationDto> {

}

const initialState = (): VacationState => (
    { ...initialBaseEntityState() }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Vacations } )
export class VacationStore extends BaseEntityStore<VacationDto, VacationState> {
    constructor() {
        super( initialState() );
    }

    @storeEvent( 'Vacation list loaded' )
    onVacationListLoaded(vacationList: VacationDto[]): void {
        this.set( vacationList );
    }

    @storeEvent( 'Vacation request created' )
    onVacationRequestCreated(vacation: VacationDto): void {
        this.add( vacation );
    }

    @storeEvent( 'Vacation request updated' )
    onVacationRequestUpdated(vacation: VacationDto): void {
        this.replace( vacation.id, vacation );
    }

    @storeEvent( 'Vacation request canceled' )
    onVacationRequestCanceled(vacation: VacationDto): void {
        this.replace( vacation.id, vacation );
    }
}
