import { IBaseState } from '@shared/store/base-state.interface';
import { BaseStore } from '@shared/store/base-store';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';

export class BaseSelector<S extends IBaseState> extends Query<S> {
    protected constructor(store: BaseStore<S>) {
        super( store );
    }

    selectSuccess(): Observable<boolean> {
        return this.select( 'success' );
    }
}
