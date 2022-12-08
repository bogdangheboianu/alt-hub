import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

interface BaseRequestConfig<Return> {
    url: string | string[];
    successCb?: (data: Return, ...args: any) => any;
    successCbExtraArgs?: any[];
    successMessage?: string;
}

export interface GetRequestConfig<Return> extends BaseRequestConfig<Return> {
}

export interface GetWithParamsRequestConfig<Return, Paras extends HttpParams> extends BaseRequestConfig<Return> {
    params: Params;
}

export interface PostRequestConfig<Return, Body extends object> extends BaseRequestConfig<Return> {
    body: Body;
}

export interface PostWithFormDataRequestConfig<Return> extends BaseRequestConfig<Return> {
    body: FormData;
}

export interface PutRequestConfig<Return, Body extends object> extends BaseRequestConfig<Return> {
    body: Body;
}

export interface PatchRequestConfig<Return, Body extends object | undefined = undefined> extends BaseRequestConfig<Return> {
    body?: Body;
}

export interface DeleteRequestConfig<Return> extends BaseRequestConfig<Return> {
}
