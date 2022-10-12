import { Injectable } from '@angular/core';
import { uiEvent } from '@shared/store/ui-event.decorator';
import { WorkLogStore } from '@work-log/store/work-log/work-log.store';

@Injectable()
export class WorkLogUiEvents {
    constructor(private workLogStore: WorkLogStore) {
    }

    @uiEvent( 'Create work log form opened' )
    onCreateWorkLogFormOpened(): void {
        this.workLogStore.resetBaseState();
    }

    @uiEvent( 'Update work log form opened' )
    onUpdateWorkLogFormOpened(): void {
        this.workLogStore.resetBaseState();
    }

    @uiEvent( 'Work logs table closed' )
    onWorkLogsTableClosed(): void {
        this.workLogStore.resetBaseState();
        this.workLogStore.set( [] );
    }
}
