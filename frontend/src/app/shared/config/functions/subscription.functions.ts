import { ComponentInstance, SimpleFn } from '@shared/config/constants/shared.types';
import { takeUntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

export function subscribeOnce(stream: Observable<any>, cb: SimpleFn): void {
    const subscription = stream.subscribe( async () => {
        await cb();
        subscription.unsubscribe();
    } );
}

export function subscribeUntilTrue(stream: Observable<boolean>, componentInstance: ComponentInstance, onTrueCb: SimpleFn): void {
    const subscription = stream.pipe( takeUntilDestroy( componentInstance ) )
                               .subscribe( async (value: boolean) => {
                                   if( value ) {
                                       await onTrueCb();
                                       subscription.unsubscribe();
                                   }
                               } );
}
