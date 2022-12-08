import { Injectable } from '@angular/core';
import { uiEvent } from '@config/store/store.decorators';
import { WorkLogStore } from '@work-logs/data/work-log.store';

@Injectable()
export class WorkLogUiEvents {
    constructor(private workLogStore: WorkLogStore) {
    }

    @uiEvent( 'Create work log form opened' )
    onCreateWorkLogFormOpened(): void {
        this.workLogStore.resetBaseState();
        this.workLogStore.setOpenWorkLogCreateFormModal( false );
    }

    @uiEvent( 'Update work log form opened' )
    onUpdateWorkLogFormOpened(): void {
        this.workLogStore.resetBaseState();
    }

    @uiEvent( 'Work logs table closed' )
    onWorkLogsTableClosed(): void {
        this.workLogStore.resetBaseState();
    }
}
