import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { storeEvent } from '@config/store/store.decorators';
import { initialBaseEntityState } from '@config/store/store.functions';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { StoreConfig } from '@datorama/akita';
import { CsvWorkLogDto } from '@dtos/csv-work-log-dto';
import { PaginatedResultDto } from '@dtos/paginated-result-dto';
import { PaginatedWorkLogsDto } from '@dtos/paginated-work-logs-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { WorkLogsFileImportResultDto } from '@dtos/work-logs-file-import-result-dto';
import { produce } from 'immer';

export interface WorkLogState extends IBaseEntityState<WorkLogDto> {
    pagination: PaginatedResultDto | null;
    csvWorkLogs: CsvWorkLogDto[];
    importResult: WorkLogsFileImportResultDto | null;
    ui: {
        openWorkLogCreateFormModal: boolean;
    };
}

const createInitialState = (): WorkLogState => (
    {
        ...initialBaseEntityState(),
        pagination  : null,
        csvWorkLogs : [],
        importResult: null,
        ui          : {
            openWorkLogCreateFormModal: false
        }
    }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.WorkLogs, producerFn: produce } )
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

    @storeEvent( 'Work logs imported from file' )
    onWorkLogsImportedFromFile(importResult: WorkLogsFileImportResultDto): void {
        this.update( { importResult } );
    }

    setOpenWorkLogCreateFormModal(value: boolean): void {
        this.update( state => {
            state.ui.openWorkLogCreateFormModal = value;
        } );
    }
}
