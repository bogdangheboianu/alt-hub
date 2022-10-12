import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { CsvWorkLogDto } from '@dtos/csv-work-log.dto';
import { PaginatedResultDto } from '@dtos/paginated-result.dto';
import { PaginatedWorkLogsDto } from '@dtos/paginated-work-logs.dto';
import { WorkLogDto } from '@dtos/work-log.dto';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';
import { BaseEntityStore } from '@shared/store/base-entity-store';
import { initialBaseEntityState } from '@shared/store/initial-base-entity-state.function';
import { storeEvent } from '@shared/store/store-event.decorator';

export interface WorkLogState extends IBaseEntityState<WorkLogDto> {
    pagination: PaginatedResultDto | null;
    csvWorkLogs: CsvWorkLogDto[];
}

const createInitialState = (): WorkLogState => (
    {
        ...initialBaseEntityState(),
        pagination : null,
        csvWorkLogs: []
    }
);

@Injectable()
@StoreConfig( { name: 'work-logs' } )
export class WorkLogStore extends BaseEntityStore<WorkLogDto, WorkLogState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'Paginated work logs loaded' )
    onPaginatedWorkLogsLoaded(paginatedWorkLogs: PaginatedWorkLogsDto): void {
        const { data, totalPages, totalRecords, hasPrevious, hasNext } = paginatedWorkLogs;
        this.set( data );
        this.update( { pagination: { totalPages, totalRecords, hasPrevious, hasNext } } );
    }

    @storeEvent( 'Csv work logs loaded' )
    onCsvWorkLogsLoaded(csvWorkLogs: CsvWorkLogDto[]): void {
        this.update( { csvWorkLogs } );
    }

    @storeEvent( 'Work log created' )
    onWorkLogCreated(workLog: WorkLogDto): void {
        this.add( workLog );
    }

    @storeEvent( 'Work log updated' )
    onWorkLogUpdated(workLog: WorkLogDto): void {
        this.replace( workLog.id, workLog );
    }
}
