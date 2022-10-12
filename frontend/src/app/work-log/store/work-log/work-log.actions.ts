import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { CreateWorkLogDto } from '@dtos/create-work-log.dto';
import { GetAllCsvWorkLogsParamsDto } from '@dtos/get-all-csv-work-logs-params.dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params.dto';
import { UpdateWorkLogDto } from '@dtos/update-work-log.dto';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from '@shared/constants/pagination.constants';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { WorkLogService } from '@work-log/services/work-log.service';
import { WorkLogRecurrenceStore } from '@work-log/store/work-log-recurrence/work-log-recurrence.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WorkLogActions {
    constructor(
        private workLogService: WorkLogService,
        private workLogRecurrenceStore: WorkLogRecurrenceStore
    ) {
    }

    @action( 'Load paginated work logs' )
    loadPaginatedWorkLogs(params?: GetPaginatedWorkLogsParamsDto): void {
        firstValueFrom( this.workLogService.getPaginatedWorkLogs( params ?? { itemsPerPage: DEFAULT_ITEMS_PER_PAGE, pageNumber: DEFAULT_PAGE_NUMBER } ) )
            .then();
    }

    @action( 'Load all csv work logs' )
    loadAllCsvWorkLogs(params?: GetAllCsvWorkLogsParamsDto): void {
        firstValueFrom( this.workLogService.getAllCsvWorkLogs( params ) )
            .then();
    }

    @action( 'Create work log' )
    createWorkLog(data: CreateWorkLogDto): void {
        firstValueFrom( this.workLogService.createWorkLog( data ) )
            .then( result => {
                if( result.isSuccessful() && valueIsNotEmpty( result.data?.recurrence ) ) {
                    this.workLogRecurrenceStore.onWorkLogRecurrenceCreated( result.data!.recurrence );
                }
            } );
    }

    @action( 'Update work log' )
    updateWorkLog(id: string, data: UpdateWorkLogDto): void {
        firstValueFrom( this.workLogService.updateWorkLog( id, data ) )
            .then();
    }
}
