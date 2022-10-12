import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence.dto';

export interface IWorkLogRecurrenceDialogData {
    userId?: string;
    workLogRecurrence?: WorkLogRecurrenceDto;
}
