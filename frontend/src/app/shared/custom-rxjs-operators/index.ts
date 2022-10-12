import { valueIsDefined } from '@shared/functions/value-is-defined.function';
import { filter, map, Observable, take } from 'rxjs';

export function takeOnce<T>(source$: Observable<T>): Observable<T> {
    return source$.pipe( take( 1 ) );
}

export function takeIfDefined<T>(source$: Observable<T>): Observable<NonNullable<T>> {
    return source$.pipe( filter( valueIsDefined ), map( v => v as NonNullable<T> ) );
}

export function takeIfTrue(source$: Observable<boolean>): Observable<boolean> {
    return source$.pipe( filter( v => v ) );
}
