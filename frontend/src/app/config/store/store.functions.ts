import { IBaseEntityState, IBaseState } from '@config/store/store.interfaces';

export const initialBaseState = (): IBaseState => (
    {
        success: false
    }
);

export const initialBaseEntityState = <Entity, IDType>(): IBaseEntityState<Entity, IDType> => (
    {
        success: false,
        loading: false,
        active : null
    }
);
