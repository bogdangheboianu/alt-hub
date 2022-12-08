import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@auth/data/auth.actions';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ApiResponseInterceptor {
    constructor(
        private readonly router: Router,
        private readonly authActions: AuthActions
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle( req )
                   .pipe(
                       catchError( err => {
                           let error = err;

                           if( err instanceof HttpErrorResponse ) {
                               error = err.error;

                               if( err.status === HttpStatusCode.Unauthorized ) {
                                   this.authActions.logout();
                               }
                           }

                           return throwError( error );
                       } )
                   );
    }
}
