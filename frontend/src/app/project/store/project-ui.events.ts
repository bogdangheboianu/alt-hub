import { Injectable } from '@angular/core';
import { ProjectStore } from '@project/store/project.store';
import { uiEvent } from '@shared/store/ui-event.decorator';

@Injectable()
export class ProjectUiEvents {
    constructor(private projectStore: ProjectStore) {
    }

    @uiEvent( 'Create project stepper opened' )
    onCreateProjectStepperOpened(): void {
        this.projectStore.resetBaseState();
    }
}
