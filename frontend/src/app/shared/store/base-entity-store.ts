import { EntityStore } from '@datorama/akita';
import { HttpErrorResponseDto } from '@dtos/http-error-response.dto';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';

export class BaseEntityStore<Entity, State extends IBaseEntityState<Entity>> extends EntityStore<State> {
    onSuccess(fromGETRequest: boolean): void {
        this.setLoading( false );

        if( !fromGETRequest ) {
            this.setSuccess( true );
        }
    }

    onError(error: HttpErrorResponseDto): void {
        this.setLoading( false );
        this.setError( error.errors );
    }

    setSuccess(value: boolean): void {
        this.update( state => (
            { ...state, success: value }
        ) );
    }

    resetBaseState(): void {
        this.update( state => (
            { ...state, loading: false, success: false, error: null }
        ) );
    }
}
