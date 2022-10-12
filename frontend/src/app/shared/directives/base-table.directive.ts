import { Directive, OnInit } from '@angular/core';
import { BaseEntitySelector } from '@shared/store/base-entity-selector';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';
import { Observable } from 'rxjs';

// export type TableColumns<Entity> = Array<DotNestedKeys<Entity>> | Array<any>;
export type TableColumns<Entity> = string[];

@Directive()
export abstract class BaseTable<Entity, State extends IBaseEntityState<Entity>> implements OnInit {
    data$!: Observable<Entity[]>;
    loading$!: Observable<boolean>;

    abstract get columns(): TableColumns<Entity>;

    private readonly _storeSelector: BaseEntitySelector<Entity, State>;

    protected constructor(storeSelector: BaseEntitySelector<Entity, State>) {
        this._storeSelector = storeSelector;
    }

    ngOnInit(): void {
        this.data$ = this._storeSelector.selectAll();
        this.loading$ = this._storeSelector.selectLoading();
    }
}
