import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { CreateWorkLogsDto } from '@dtos/create-work-logs-dto';
import { GetAllCsvWorkLogsParamsDto } from '@dtos/get-all-csv-work-logs-params-dto';
import { GetPaginatedWorkLogsParamsDto } from '@dtos/get-paginated-work-logs-params-dto';
import { UpdateWorkLogDto } from '@dtos/update-work-log-dto';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from '@shared/config/constants/shared.constants';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { WorkLogApiService } from '@work-logs/data/work-log-api.service';
import { WorkLogRecurrenceStore } from '@work-logs/data/work-log-recurrence.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WorkLogActions {
    constructor(
        private workLogApiService: WorkLogApiService,
        private workLogRecurrenceStore: WorkLogRecurrenceStore
    ) {
    }

    @action( 'Load paginated work logs' )
    loadPaginatedWorkLogs(params?: GetPaginatedWorkLogsParamsDto): void {
        firstValueFrom( this.workLogApiService.getPaginatedWorkLogs( params ?? {
            itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
            pageNumber  : DEFAULT_PAGE_NUMBER
        } ) )
            .then();
    }

    @action( 'Load all csv work logs' )
    loadAllCsvWorkLogs(params?: GetAllCsvWorkLogsParamsDto): void {
        firstValueFrom( this.workLogApiService.getAllCsvWorkLogs( params ) )
            .then();
    }

    @action( 'Create work logs' )
    createWorkLogs(data: CreateWorkLogsDto): void {
        firstValueFrom( this.workLogApiService.createWorkLogs( data ) )
            .then( result => {
                if( result.isSuccessful() ) {
                    const firstWorkLog = result.data![0];
                    if( valueIsNotEmpty( firstWorkLog?.recurrence ) ) {
                        this.workLogRecurrenceStore.onWorkLogRecurrenceCreated( firstWorkLog.recurrence! );
                    }
                }
            } );
    }

    @action( 'Update work log' )
    updateWorkLog(id: string, data: UpdateWorkLogDto): void {
        firstValueFrom( this.workLogApiService.updateWorkLog( id, data ) )
            .then();
    }

    @action( 'Delete work log' )
    deleteWorkLog(id: string): void {
        firstValueFrom( this.workLogApiService.deleteWorkLog( id ) )
            .then();
    }

    @action( 'Import work logs from file' )
    importWorkLogsFromFile(file: File): void {
        firstValueFrom( this.workLogApiService.importWorkLogsFromFile( file ) )
            .then();
    }
}
