import { IBaseState } from '@shared/store/base-state.interface';
import { Store } from '@datorama/akita';
import { HttpErrorResponseDto } from '@dtos/http-error-response.dto';

export class BaseStore<State extends IBaseState> extends Store<State> {
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
        this.update( { ...this.getValue(), success: value } );
    }

    resetBaseState(): void {
        this.update( state => (
            { ...state, loading: false, success: false, error: null }
        ) );
    }
}
