import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntitySelector } from '@config/store/store.models';
import { Entity } from '@shared/config/constants/shared.interfaces';
import { takeIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { getParamFromRoute } from '@shared/config/functions/route.functions';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';
import { takeUntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

export interface DetailsComponentData<E extends Entity> {
    entity: E;
}

export abstract class DetailsComponentDataService<E extends Entity, Data extends object> extends BaseComponentDataService<Data, DetailsComponentData<E>> {
    private readonly _route: ActivatedRoute;

    protected constructor(selector: BaseEntitySelector<E, any>) {
        super( selector );
        this._route = inject( ActivatedRoute );
    }

    get entity$(): Observable<E> {
        return this.extraDataSource()
                   .entity
                   .pipe( takeUntilDestroy( this.componentInstance ) );
    }

    get entity(): Promise<E> {
        return this.dataAsPromise.then( data => data.entity! );
    }

    getIdFromRoute(): Observable<string> {
        return getParamFromRoute( 'id', this._route )
            .pipe( takeUntilDestroy( this.componentInstance ), takeIfDefined );
    }

    protected override extraDataSource(): ComponentDataSource<DetailsComponentData<E>> {
        const selector = this.selector as BaseEntitySelector<E, IBaseEntityState<E>>;
        const entity = selector.selectActive() as Observable<E | undefined>;
        return { entity: entity.pipe( takeIfDefined ) };
    }
}
