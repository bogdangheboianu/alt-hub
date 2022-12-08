import { Injectable } from '@angular/core';
import { action } from '@datorama/akita';
import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence-dto';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence-dto';
import { WorkLogRecurrenceApiService } from '@work-logs/data/work-log-recurrence-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WorkLogRecurrenceActions {
    constructor(
        private readonly workLogRecurrenceApiService: WorkLogRecurrenceApiService
    ) {
    }

    @action( 'Load all user work log recurrences' )
    loadAllUserWorkLogRecurrences(): void {
        firstValueFrom( this.workLogRecurrenceApiService.getAllUserWorkLogRecurrences() )
            .then();
    }

    @action( 'Create work log recurrence' )
    createWorkLogRecurrence(data: CreateWorkLogRecurrenceDto): void {
        firstValueFrom( this.workLogRecurrenceApiService.createWorkLogRecurrence( data ) )
            .then();
    }

    @action( 'Update work log recurrence' )
    updateWorkLogRecurrence(id: string, data: UpdateWorkLogRecurrenceDto): void {
        firstValueFrom( this.workLogRecurrenceApiService.updateWorkLogRecurrence( id, data ) )
            .then();
    }

    @action( 'Activate work log recurrence' )
    activateWorkLogRecurrence(id: string): void {
        firstValueFrom( this.workLogRecurrenceApiService.activateWorkLogRecurrence( id ) )
            .then();
    }

    @action( 'Deactivate work log recurrence' )
    deactivateWorkLogRecurrence(id: string): void {
        firstValueFrom( this.workLogRecurrenceApiService.deactivateWorkLogRecurrence( id ) )
            .then();
    }

    @action( 'Delete work log recurrence' )
    deleteWorkLogRecurrence(id: string): void {
        firstValueFrom( this.workLogRecurrenceApiService.deleteWorkLogRecurrence( id ) )
            .then();
    }
}
