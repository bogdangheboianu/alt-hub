import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import { HttpHeadersInterceptor } from '@shared/interceptors/http-headers.interceptor';

@Module( {
             imports  : [],
             providers: [
                 GlobalExceptionFilter,
                 HttpHeadersInterceptor
             ],
             exports  : [
                 GlobalExceptionFilter,
                 HttpHeadersInterceptor
             ]
         } )
export class SharedModule {
}
