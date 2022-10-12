import { AfterViewInit, Directive, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedResultDto } from '@dtos/paginated-result.dto';
import { PaginationParamsDto } from '@dtos/pagination-params.dto';
import { DEFAULT_ITEMS_PER_PAGE } from '@shared/constants/pagination.constants';
import { BaseTable } from '@shared/directives/base-table.directive';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { map, Observable } from 'rxjs';

@Directive()
@UntilDestroy()
export abstract class BasePaginatedTable<Entity, State extends IBaseEntityState<Entity>> extends BaseTable<Entity, State> implements OnInit, AfterViewInit {
    @ViewChild( MatPaginator )
    paginator!: MatPaginator;

    dataSource$!: Observable<MatTableDataSource<Entity>>;
    pageSizeOptions = [ 5, 10, 20, 40, 80 ];
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
    abstract pagination$: Observable<PaginatedResultDto | null>;

    @Output()
    onPageChange = new EventEmitter<PaginationParamsDto>();

    override ngOnInit(): void {
        super.ngOnInit();
        this.dataSource$ = this.dataToTableDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource$
            .pipe( takeUntilDestroy( this ) )
            .subscribe( dataSource => dataSource.paginator = this.paginator );
    }

    onPage(event: PageEvent): void {
        this.onPageChange.emit( {
                                    pageNumber  : event.pageIndex,
                                    itemsPerPage: event.pageSize
                                } );
    }

    private dataToTableDataSource(): Observable<MatTableDataSource<Entity>> {
        return this.data$.pipe( map( data => new MatTableDataSource<Entity>( data ) ) );
    }
}
