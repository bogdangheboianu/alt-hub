import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class HttpHeadersInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp()
                               .getRequest();
        const headers = request?.headers;

        if( valueIsEmpty( headers[CustomHttpHeaders.CorrelationId.property] ) ) {
            const error: IException = {
                name   : 'missingHeaders',
                message: `Missing '${ CustomHttpHeaders.CorrelationId.header }' header`,
                field  : null
            };
            return throwError( () => new BadRequestException( error ) );
        } else {
            request.correlationId = headers[CustomHttpHeaders.CorrelationId.property];
        }

        return next.handle();
    }
}
