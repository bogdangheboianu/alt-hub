import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@auth/data/auth.actions';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { AUTHORIZATION_HEADER } from '@shared/config/constants/shared.constants';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { map, Observable, switchMap } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private readonly router: Router,
        private readonly authActions: AuthActions,
        private readonly authQuery: AuthSelectors
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authQuery.selectAccessToken()
                   .pipe(
                       switchMap( (accessToken: string | null) => {
                           if( valueIsNotEmpty( accessToken ) ) {
                               const requestWithToken = req.clone(
                                   {
                                       headers: req.headers.set( AUTHORIZATION_HEADER, `Bearer ${ accessToken }` )
                                   } );
                               return next.handle( requestWithToken )
                                          .pipe(
                                              map( (event: HttpEvent<any>) => {
                                                  if( event instanceof HttpResponse ) {
                                                      if( event.status === 401 ) {
                                                          this.authActions.logout();
                                                      }
                                                  }

                                                  return event;
                                              } )
                                          );
                           }
                           return next.handle( req );
                       } )
                   );
    }

}
