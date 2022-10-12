import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence.dto';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence.dto';
import { WorkLogRecurrenceService } from '@work-log/services/work-log-recurrence.service';
import { WorkLogRecurrenceStore } from '@work-log/store/work-log-recurrence/work-log-recurrence.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WorkLogRecurrenceActions {
    constructor(
        private readonly workLogRecurrenceService: WorkLogRecurrenceService,
        private readonly workLogRecurrenceStore: WorkLogRecurrenceStore
    ) {
    }

    @action( 'Load all user work log recurrences' )
    loadAllUserWorkLogRecurrences(): void {
        firstValueFrom( this.workLogRecurrenceService.getAllUserWorkLogRecurrences() )
            .then();
    }

    @action( 'Create work log recurrence' )
    createWorkLogRecurrence(data: CreateWorkLogRecurrenceDto): void {
        firstValueFrom( this.workLogRecurrenceService.createWorkLogRecurrence( data ) )
            .then();
    }

    @action( 'Update work log recurrence' )
    updateWorkLogRecurrence(id: string, data: UpdateWorkLogRecurrenceDto): void {
        firstValueFrom( this.workLogRecurrenceService.updateWorkLogRecurrence( id, data ) )
            .then();
    }

    @action( 'Activate work log recurrence' )
    activateWorkLogRecurrence(id: string): void {
        firstValueFrom( this.workLogRecurrenceService.activateWorkLogRecurrence( id ) )
            .then();
    }

    @action( 'Deactivate work log recurrence' )
    deactivateWorkLogRecurrence(id: string): void {
        firstValueFrom( this.workLogRecurrenceService.deactivateWorkLogRecurrence( id ) )
            .then();
    }
}
