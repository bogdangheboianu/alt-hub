import { Injectable } from '@angular/core';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence.dto';
import { BaseEntitySelector } from '@shared/store/base-entity-selector';
import { WorkLogRecurrenceState, WorkLogRecurrenceStore } from '@work-log/store/work-log-recurrence/work-log-recurrence.store';

@Injectable()
export class WorkLogRecurrenceSelectors extends BaseEntitySelector<WorkLogRecurrenceDto, WorkLogRecurrenceState> {
    constructor(protected workLogRecurrenceStore: WorkLogRecurrenceStore) {
        super( workLogRecurrenceStore );
    }
}
