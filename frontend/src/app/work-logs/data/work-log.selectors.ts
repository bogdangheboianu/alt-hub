import { Injectable } from '@angular/core';
import { BaseEntitySelector } from '@config/store/store.models';
import { CsvWorkLogDto } from '@dtos/csv-work-log-dto';
import { PaginatedResultDto } from '@dtos/paginated-result-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { WorkLogState, WorkLogStore } from '@work-logs/data/work-log.store';
import { Observable } from 'rxjs';

@Injectable()
export class WorkLogSelectors extends BaseEntitySelector<WorkLogDto, WorkLogState> {
    constructor(protected workLogStore: WorkLogStore) {
        super( workLogStore );
    }

    selectPagination(): Observable<PaginatedResultDto | null> {
        return this.select( state => state.pagination );
    }

    selectCsvWorkLogs(): Observable<CsvWorkLogDto[]> {
        return this.select( state => state.csvWorkLogs );
    }

    selectOpenWorkLogCreateFormModal(): Observable<boolean> {
        return this.select( state => state.ui.openWorkLogCreateFormModal );
    }
}
