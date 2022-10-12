import { Injectable } from '@angular/core';
import { CsvWorkLogDto } from '@dtos/csv-work-log.dto';
import { PaginatedResultDto } from '@dtos/paginated-result.dto';
import { WorkLogDto } from '@dtos/work-log.dto';
import { BaseEntitySelector } from '@shared/store/base-entity-selector';
import { WorkLogState, WorkLogStore } from '@work-log/store/work-log/work-log.store';
import { Observable } from 'rxjs';

@Injectable()
export class WorkLogSelectors extends BaseEntitySelector<WorkLogDto, WorkLogState> {
    constructor(protected workLogStore: WorkLogStore) {
        super( workLogStore );
    }

    selectPagination(): Observable<PaginatedResultDto | null> {
        return this.select( 'pagination' );
    }

    selectCsvWorkLogs(): Observable<CsvWorkLogDto[]> {
        return this.select( 'csvWorkLogs' );
    }
}
