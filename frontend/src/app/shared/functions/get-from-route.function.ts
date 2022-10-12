import { ActivatedRoute } from '@angular/router';
import { takeIfDefined } from '@shared/custom-rxjs-operators';
import { map, Observable } from 'rxjs';

export function getParamFromRoute(paramName: string, route: ActivatedRoute): Observable<string> {
    return route.paramMap.pipe(
        map( params => params.get( paramName ) ),
        takeIfDefined
    );
}

export function getQueryParamFromRoute(paramName: string, route: ActivatedRoute): Observable<string> {
    return route.queryParamMap.pipe(
        map( params => params.get( paramName ) ),
        takeIfDefined
    );
}
