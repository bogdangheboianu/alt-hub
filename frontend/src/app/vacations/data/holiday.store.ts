import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { storeEvent } from '@config/store/store.decorators';
import { initialBaseEntityState } from '@config/store/store.functions';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { StoreConfig } from '@datorama/akita';
import { HolidayDto } from '@dtos/holiday-dto';

export interface HolidayState extends IBaseEntityState<HolidayDto> {

}

const initialState = (): HolidayState => (
    { ...initialBaseEntityState() }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Holidays } )
export class HolidayStore extends BaseEntityStore<HolidayDto, HolidayState> {
    constructor() {
        super( initialState() );
    }

    @storeEvent( 'Holiday list loaded' )
    onHolidayListLoaded(holidayList: HolidayDto[]): void {
        this.set( holidayList );
    }
}
