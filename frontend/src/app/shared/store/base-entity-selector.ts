import { QueryEntity } from '@datorama/akita';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';
import { BaseEntityStore } from '@shared/store/base-entity-store';
import { Observable } from 'rxjs';

export class BaseEntitySelector<Entity, State extends IBaseEntityState<Entity>> extends QueryEntity<State> {
    protected constructor(store: BaseEntityStore<Entity, State>) {
        super( store );
    }

    selectSuccess(): Observable<boolean> {
        return this.select( 'success' );
    }
}
