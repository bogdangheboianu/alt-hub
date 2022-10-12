import { BaseException } from '@shared/models/base-exception/base-exception';

export class InvalidDateIntervalException extends BaseException {
    name = 'invalid_date_interval';
    message = 'This is not a valid date interval';

    constructor(field: string) {
        super( field );
    }
}

export class NotFutureDateException extends BaseException {
    name = 'not_future_date';
    message = 'This date must be in the future';

    constructor(field: string) {
        super( field );
    }
}
