import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { ApiRequestInterceptor } from '@config/interceptors/api-request.interceptor';
import { ApiResponseInterceptor } from '@config/interceptors/api-response.interceptor';
import { JwtInterceptor } from '@config/interceptors/jwt.interceptor';

export const interceptorProviders: Provider[] = [
    {
        provide : HTTP_INTERCEPTORS,
        useClass: ApiRequestInterceptor,
        multi   : true
    },
    {
        provide : HTTP_INTERCEPTORS,
        useClass: ApiResponseInterceptor,
        multi   : true
    },
    {
        provide : HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi   : true
    }
];
