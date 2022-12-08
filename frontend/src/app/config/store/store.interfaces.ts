import { ActiveState, EntityState } from '@datorama/akita';

export interface IBaseState {
    success: boolean;
}

export interface IBaseEntityState<Entity, IDType = string> extends EntityState<Entity, IDType>, ActiveState {
    success: boolean;
}
