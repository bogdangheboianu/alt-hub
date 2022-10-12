import { IBaseEntityState } from '@shared/store/base-entity-state.interface';

export const initialBaseEntityState = <Entity, IDType>(): IBaseEntityState<Entity, IDType> => (
    {
        success: false,
        loading: false,
        active : null
    }
);
