import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence.dto';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';
import { BaseEntityStore } from '@shared/store/base-entity-store';
import { initialBaseEntityState } from '@shared/store/initial-base-entity-state.function';
import { storeEvent } from '@shared/store/store-event.decorator';

export interface WorkLogRecurrenceState extends IBaseEntityState<WorkLogRecurrenceDto> {
}

const createInitialState = (): WorkLogRecurrenceState => (
    { ...initialBaseEntityState() }
);

@Injectable()
@StoreConfig( { name: 'work-log-recurrences' } )
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
}
