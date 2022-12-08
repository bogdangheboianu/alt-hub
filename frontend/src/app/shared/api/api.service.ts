import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BaseEntityStore, BaseStore } from '@config/store/store.models';
import { ApiResult } from '@shared/api/api-result';
import { valueIsHttpErrorResponseDto } from '@shared/config/functions/value.functions';
import { MessageService } from '@shared/features/message/message.service';
import { catchError, map, Observable, of, tap } from 'rxjs';

export class ApiService {
    private readonly messageService = inject( MessageService );
    private readonly http = inject( HttpClient );
    private readonly store: BaseEntityStore<any, any> | BaseStore<any>;

    constructor(store: BaseEntityStore<any, any> | BaseStore<any>) {
        this.store = store;
    }

    get<Return>(url: string, successCb?: (data: Return, ...args: any[]) => any, ...successCbExtraArgs: any[]): Observable<ApiResult<Return>> {
        this.store.onRequestInit();
        return this.handleResponse( this.http.get<Return>( url ), true, successCb, successCbExtraArgs );
    }

    getWithParams<Params extends HttpParams, Return>(url: string, params: Params, successCb?: (data: Return, ...args: any[]) => any, ...successCbExtraArgs: any[]): Observable<ApiResult<Return>> {
        this.store.onRequestInit();
        return this.handleResponse( this.http.get<Return>( url, { params } ), true, successCb, successCbExtraArgs );
    }

    getFile(url: string): Observable<ApiResult<Blob>> {
        this.store.onRequestInit();
        return this.handleResponse<Blob>( this.http.get( url, { responseType: 'blob' } ), true );
    }

    post<Body, Return>(url: string, body: Body, successCb?: (data: Return, ...args: any[]) => any, ...successCbExtraArgs: any[]): Observable<ApiResult<Return>> {
        this.store.onRequestInit();
        return this.handleResponse( this.http.post<Return>( url, body ), false, successCb, successCbExtraArgs );
    }

    postWithFormData<Return>(url: string, body: FormData, successCb?: (data: Return, ...args: any[]) => any, ...successCbExtraArgs: any[]): Observable<ApiResult<Return>> {
        this.store.onRequestInit();
        return this.handleResponse( this.http.post<Return>( url, body ), false, successCb, successCbExtraArgs );
    }

    put<Body, Return>(url: string, body: Body, successCb?: (data: Return, ...args: any[]) => any, ...successCbExtraArgs: any[]): Observable<ApiResult<Return>> {
        this.store.onRequestInit();
        return this.handleResponse( this.http.put<Return>( url, body ), false, successCb, successCbExtraArgs );
    }

    patch<Body, Return>(url: string, body: Body, successCb?: (data: Return, ...args: any[]) => any, ...successCbExtraArgs: any[]): Observable<ApiResult<Return>> {
        this.store.onRequestInit();
        return this.handleResponse( this.http.patch<Return>( url, body ), false, successCb, successCbExtraArgs );
    }

    delete<Return>(url: string, successCb?: (data: Return, ...args: any[]) => any, ...successCbExtraArgs: any[]): Observable<ApiResult<Return>> {
        this.store.onRequestInit();
        return this.handleResponse( this.http.delete<Return>( url ), false, successCb, successCbExtraArgs );
    }

    private handleResponse<Return>(response: Observable<Return>, fromGETRequest: boolean, successCb?: (data: Return, ...args: any[]) => any, ...successCbExtraArgs: any[]): Observable<ApiResult<Return>> {
        return response.pipe(
            tap( () => this.store.onSuccess( fromGETRequest ) ),
            map( (data: Return) => new ApiResult( { data } ) ),
            tap( (result: ApiResult<Return>) => {
                if( successCb ) {
                    successCb( result.data!, ...successCbExtraArgs );
                }

                setTimeout( () => this.store.resetBaseState(), 200 );
            } ),
            catchError( this.handleError<Return>.bind( this ) )
        );
    }

    private handleError<Return>(error: any): Observable<ApiResult<Return>> {
        if( valueIsHttpErrorResponseDto( error ) ) {
            this.store.onError( error );
            this.messageService.error( error );
        } else {
            this.store.setLoading( false );
            console.error( error );
        }

        return of( new ApiResult<Return>( { error } ) );
    }
}
