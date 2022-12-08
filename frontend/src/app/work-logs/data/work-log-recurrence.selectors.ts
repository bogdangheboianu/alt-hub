import { Injectable } from '@angular/core';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence-dto';
import { BaseEntitySelector } from '@config/store/store.models';
import { WorkLogRecurrenceState, WorkLogRecurrenceStore } from '@work-logs/data/work-log-recurrence.store';

@Injectable()
export class WorkLogRecurrenceSelectors extends BaseEntitySelector<WorkLogRecurrenceDto, WorkLogRecurrenceState> {
    constructor(protected workLogRecurrenceStore: WorkLogRecurrenceStore) {
        super( workLogRecurrenceStore );
    }
}
