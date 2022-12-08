import { IBaseEntityState, IBaseState } from '@config/store/store.interfaces';
import { EntityStore, Query, QueryEntity, Store } from '@datorama/akita';
import { ErrorDto } from '@dtos/error-dto';
import { HttpErrorResponseDto } from '@dtos/http-error-response-dto';
import { Observable } from 'rxjs';

export class BaseStore<State extends IBaseState> extends Store<State> {
    onRequestInit(): void {
        this.update( state => (
            { ...state, loading: true, success: false, error: null }
        ) );
    }

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

export class BaseSelector<S extends IBaseState> extends Query<S> {
    protected constructor(store: BaseStore<S>) {
        super( store );
    }

    selectSuccess(): Observable<boolean> {
        return this.select( 'success' );
    }
}

export class BaseEntityStore<Entity, State extends IBaseEntityState<Entity>> extends EntityStore<State> {
    onRequestInit(): void {
        this.update( state => (
            { ...state, loading: true, success: false, error: null }
        ) );
    }

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

export class BaseEntitySelector<Entity, State extends IBaseEntityState<Entity>> extends QueryEntity<State> {
    protected constructor(store: BaseEntityStore<Entity, State>) {
        super( store );
    }

    selectSuccess(): Observable<boolean> {
        return this.select( state => state.success );
    }

    selectErrors(): Observable<ErrorDto[]> {
        return this.selectError<ErrorDto[]>();
    }
}
