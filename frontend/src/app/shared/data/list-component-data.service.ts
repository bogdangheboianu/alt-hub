import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntitySelector } from '@config/store/store.models';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';

export interface ListComponentData<Entity extends object> {
    entities: Entity[];
}

export abstract class ListComponentDataService<Entity extends object, Data extends object> extends BaseComponentDataService<Data, ListComponentData<Entity>> {
    protected constructor(selector: BaseEntitySelector<Entity, any>) {
        super( selector );
    }

    protected override extraDataSource(): ComponentDataSource<ListComponentData<Entity>> {
        const selector = this.selector as BaseEntitySelector<Entity, IBaseEntityState<Entity>>;
        return { entities: selector.selectAll() };
    }
}
