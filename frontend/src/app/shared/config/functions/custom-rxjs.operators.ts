import { valueIsDefined } from '@shared/config/functions/value.functions';
import { filter, map, Observable, take } from 'rxjs';

export function takeOnce<T>(source$: Observable<T>): Observable<T> {
    return source$.pipe( take( 1 ) );
}

export function takeOnceIfDefined<T>(source$: Observable<T>): Observable<NonNullable<T>> {
    return source$.pipe( take( 1 ), takeIfDefined );
}

export function takeIfDefined<T>(source$: Observable<T>): Observable<NonNullable<T>> {
    return source$.pipe( filter( valueIsDefined ), map( v => v as NonNullable<T> ) );
}

export function takeIfTrue(source$: Observable<boolean>): Observable<boolean> {
    return source$.pipe( filter( v => v ) );
}
