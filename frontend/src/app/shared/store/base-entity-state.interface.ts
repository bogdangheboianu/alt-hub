import { ActiveState, EntityState } from '@datorama/akita';

export interface IBaseEntityState<Entity, IDType = string> extends EntityState<Entity, IDType>, ActiveState {
    success: boolean;
}
