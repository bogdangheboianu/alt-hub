import { BaseEntitySelector, BaseSelector } from '@config/store/store.models';
import { ComponentInstance } from '@shared/config/constants/shared.types';
import { takeOnceIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { takeUntilDestroy } from 'ngx-reactivetoolkit';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';

type BaseComponentData = { loading: boolean; success: boolean; }
export type ComponentDataSource<Data extends object> = { [Property in keyof Data]: Observable<Data[Property]> };
type FullComponentData<ComponentData extends object, ExtraComponentData extends object> = BaseComponentData & ComponentData & ExtraComponentData

export abstract class BaseComponentDataService<ComponentData extends object, ExtraComponentData extends object = {}>{
    data$: BehaviorSubject<FullComponentData<ComponentData, ExtraComponentData> | null>;
    source?: ComponentDataSource<FullComponentData<ComponentData, ExtraComponentData>>;

    protected componentInstance?: ComponentInstance;
    protected readonly selector: BaseSelector<any> | BaseEntitySelector<any, any>;

    protected constructor(selector: BaseSelector<any> | BaseEntitySelector<any, any>) {
        this.selector = selector;
        this.data$ = new BehaviorSubject<FullComponentData<ComponentData, ExtraComponentData> | null>( null );
    }

    init(componentInstance: ComponentInstance): void {
        this.componentInstance = componentInstance;
        this.setData();
        this.onInit();
    }

    get dataAsPromise(): Promise<FullComponentData<ComponentData, ExtraComponentData>> {
        return firstValueFrom( this.data$.pipe( takeOnceIfDefined ) );
    }

    protected abstract onInit(): void;

    protected abstract dataSource(): ComponentDataSource<ComponentData>;

    protected extraDataSource(): ComponentDataSource<ExtraComponentData> {
        return {} as ComponentDataSource<ExtraComponentData>
    };

    private setData(): void {
        const dataSource = this.dataSource();
        const extraDataSource = this.extraDataSource();
        const loading = this.selector.selectLoading();
        const success = this.selector.selectSuccess();

        const sources = [ ...Object.values( dataSource ), ...Object.values( extraDataSource ), loading, success ];
        const keys = [ ...Object.keys( dataSource ), ...Object.keys( extraDataSource ), 'loading', 'success' ];

        combineLatest( sources )
            .pipe( takeUntilDestroy( this.componentInstance ) )
            .subscribe( values => {
                const data: any = {};
                values.forEach( (val, idx) => data[keys[idx]] = val );
                this.data$.next( data as FullComponentData<ComponentData, ExtraComponentData> );
            } );

        this.source = { ...dataSource, ...extraDataSource, loading, success } as ComponentDataSource<FullComponentData<ComponentData, ExtraComponentData>>;
    }
}
