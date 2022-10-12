import { Injectable } from '@angular/core';
import { uiEvent } from '@shared/store/ui-event.decorator';
import { UserStore } from '@user/store/user.store';

@Injectable()
export class UserUiEvents {
    constructor(private userStore: UserStore) {
    }

    @uiEvent( 'Create user stepper opened' )
    onCreateUserStepperOpened(): void {
        this.userStore.resetBaseState();
    }
}
