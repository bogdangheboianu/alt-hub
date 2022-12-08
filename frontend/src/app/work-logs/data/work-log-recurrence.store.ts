import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { DeletedEntityResponseDto } from '@dtos/deleted-entity-response-dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence-dto';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { initialBaseEntityState } from '@config/store/store.functions';
import { storeEvent } from '@config/store/store.decorators';
import { StoreNameEnum } from '@config/store/store.constants';

export interface WorkLogRecurrenceState extends IBaseEntityState<WorkLogRecurrenceDto> {
}

const createInitialState = (): WorkLogRecurrenceState => (
    { ...initialBaseEntityState() }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.WorkLogRecurrences } )
export class WorkLogRecurrenceStore extends BaseEntityStore<WorkLogRecurrenceDto, WorkLogRecurrenceState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'User work log recurrences loaded' )
    onUserWorkLogRecurrencesLoaded(workLogRecurrences: WorkLogRecurrenceDto[]): void {
        this.set( workLogRecurrences );
    }

    @storeEvent( 'Work log recurrence created' )
    onWorkLogRecurrenceCreated(workLogRecurrence: WorkLogRecurrenceDto): void {
        this.add( workLogRecurrence );
    }

    @storeEvent( 'Work log recurrence updated' )
    onWorkLogRecurrenceUpdated(workLogRecurrence: WorkLogRecurrenceDto): void {
        this.replace( workLogRecurrence.id, workLogRecurrence );
    }

    @storeEvent( 'Work log recurrence activated' )
    onWorkLogRecurrenceActivated(workLogRecurrence: WorkLogRecurrenceDto): void {
        this.replace( workLogRecurrence.id, workLogRecurrence );
    }

    @storeEvent( 'Work log recurrence deactivated' )
    onWorkLogRecurrenceDeactivated(workLogRecurrence: WorkLogRecurrenceDto): void {
        this.replace( workLogRecurrence.id, workLogRecurrence );
    }

    @storeEvent( 'Work log recurrence deleted' )
    onWorkLogRecurrenceDeleted(data: DeletedEntityResponseDto): void {
        this.remove( data.deletedId );
    }
}
