import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CORRELATION_ID_HEADER } from '@shared/config/constants/shared.constants';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newRequest = req.clone(
            { headers: req.headers.set( CORRELATION_ID_HEADER, uuidv4() ) }
        );
        return next.handle( newRequest );
    }
}
