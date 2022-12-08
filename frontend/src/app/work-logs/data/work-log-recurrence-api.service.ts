import { Injectable } from '@angular/core';
import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence-dto';
import { DeletedEntityResponseDto } from '@dtos/deleted-entity-response-dto';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence-dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence-dto';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiResult } from '@shared/api/api-result';
import { ApiService } from '@shared/api/api.service';
import { WorkLogRecurrenceStore } from '@work-logs/data/work-log-recurrence.store';
import { Observable } from 'rxjs';

@Injectable()
export class WorkLogRecurrenceApiService extends ApiService {
    constructor(private workLogRecurrenceStore: WorkLogRecurrenceStore) {
        super( workLogRecurrenceStore );
    }

    getAllUserWorkLogRecurrences(): Observable<ApiResult<WorkLogRecurrenceDto[]>> {
        return this.get( apiRoutes.workLogs.recurrences, this.workLogRecurrenceStore.onUserWorkLogRecurrencesLoaded.bind( this.workLogRecurrenceStore ) );
    }

    createWorkLogRecurrence(data: CreateWorkLogRecurrenceDto): Observable<ApiResult<WorkLogRecurrenceDto>> {
        return this.post( apiRoutes.workLogs.recurrences, data, this.workLogRecurrenceStore.onWorkLogRecurrenceCreated.bind( this.workLogRecurrenceStore ) );
    }

    updateWorkLogRecurrence(id: string, data: UpdateWorkLogRecurrenceDto): Observable<ApiResult<WorkLogRecurrenceDto>> {
        return this.put( `${ apiRoutes.workLogs.recurrences }/${ id }`, data, this.workLogRecurrenceStore.onWorkLogRecurrenceUpdated.bind( this.workLogRecurrenceStore ) );
    }

    activateWorkLogRecurrence(id: string): Observable<ApiResult<WorkLogRecurrenceDto>> {
        return this.patch( `${ apiRoutes.workLogs.recurrences }/${ id }/activate`, {}, this.workLogRecurrenceStore.onWorkLogRecurrenceActivated.bind( this.workLogRecurrenceStore ) );
    }

    deactivateWorkLogRecurrence(id: string): Observable<ApiResult<WorkLogRecurrenceDto>> {
        return this.patch( `${ apiRoutes.workLogs.recurrences }/${ id }/deactivate`, {}, this.workLogRecurrenceStore.onWorkLogRecurrenceDeactivated.bind( this.workLogRecurrenceStore ) );
    }

    deleteWorkLogRecurrence(id: string): Observable<ApiResult<DeletedEntityResponseDto>> {
        return this.delete( `${ apiRoutes.workLogs.recurrences }/${ id }`, this.workLogRecurrenceStore.onWorkLogRecurrenceDeleted.bind( this.workLogRecurrenceStore ) );
    }
}
