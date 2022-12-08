import { BaseException } from '@shared/models/base-exception/base-exception';

export class WorkLogNotFoundException extends BaseException {
    name = 'work_log_not_found';
    message = 'No work log was found with the given id';
}

export class WorkLogRecurrenceNotFoundException extends BaseException {
    name = 'work_log_recurrence_not_found';
    message = 'No work log recurrence was found with the given id';
}

export class InvalidWorkLogsCsvFileException extends BaseException {
    name = 'invalid_work_logs_csv_file';

    constructor(reason: string) {
        super( 'file' );
        this.message = `Invalid work logs csv file; [REASON]: ${ reason }`;
    }
}

export class IncompatibleWorkLogsException extends BaseException {
    name = 'incompatible_work_logs';
    message = 'These two work logs cannot be merged because of their incompatibility';
}
