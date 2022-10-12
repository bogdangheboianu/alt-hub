import { Injectable } from '@angular/core';
import { apiRoutes } from '@shared/constants/api.routes';
import { ApiResult } from '@shared/models/api-result';
import { ApiService } from '@shared/services/api.service';
import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence.dto';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence.dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence.dto';
import { WorkLogRecurrenceStore } from '@work-log/store/work-log-recurrence/work-log-recurrence.store';
import { Observable } from 'rxjs';

@Injectable()
export class WorkLogRecurrenceService extends ApiService {
    constructor(private workLogRecurrenceStore: WorkLogRecurrenceStore) {
        super( workLogRecurrenceStore );
    }

    getAllUserWorkLogRecurrences(): Observable<ApiResult<WorkLogRecurrenceDto[]>> {
        return this.get( apiRoutes.workLogRecurrences, this.workLogRecurrenceStore.onUserWorkLogRecurrencesLoaded.bind( this.workLogRecurrenceStore ) );
    }

    createWorkLogRecurrence(data: CreateWorkLogRecurrenceDto): Observable<ApiResult<WorkLogRecurrenceDto>> {
        return this.post( apiRoutes.workLogRecurrences, data, this.workLogRecurrenceStore.onWorkLogRecurrenceCreated.bind( this.workLogRecurrenceStore ) );
    }

    updateWorkLogRecurrence(id: string, data: UpdateWorkLogRecurrenceDto): Observable<ApiResult<WorkLogRecurrenceDto>> {
        return this.put( `${ apiRoutes.workLogRecurrences }/${ id }`, data, this.workLogRecurrenceStore.onWorkLogRecurrenceUpdated.bind( this.workLogRecurrenceStore ) );
    }

    activateWorkLogRecurrence(id: string): Observable<ApiResult<WorkLogRecurrenceDto>> {
        return this.patch( `${ apiRoutes.workLogRecurrences }/${ id }/activate`, {}, this.workLogRecurrenceStore.onWorkLogRecurrenceActivated.bind( this.workLogRecurrenceStore ) );
    }

    deactivateWorkLogRecurrence(id: string): Observable<ApiResult<WorkLogRecurrenceDto>> {
        return this.patch( `${ apiRoutes.workLogRecurrences }/${ id }/deactivate`, {}, this.workLogRecurrenceStore.onWorkLogRecurrenceDeactivated.bind( this.workLogRecurrenceStore ) );
    }
}
