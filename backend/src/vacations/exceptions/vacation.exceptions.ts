import { BaseException } from '@shared/models/base-exception/base-exception';

export class MissingVacationReasonException extends BaseException {
    name = 'missing_vacation_reason';
    message = 'A reason must be provided for vacation requests of type \'Unpaid Leave\'';
    field = 'reason';
}

export class NotEnoughPaidLeaveDaysException extends BaseException {
    name = 'not_enough_paid_leave_days';
    message = 'Total remaining annual paid leave days exceeded';
}

export class PaidLeaveDaysConsumedException extends BaseException {
    name = 'paid_leave_days_consumed';
    message = 'All annual paid leave days are consumed';
}

export class OverlappingVacationDatesException extends BaseException {
    name = 'overlapping_vacation_dates';
    message = 'Some vacation dates are overlapping with given dates';
}

export class NoWorkingDaysException extends BaseException {
    name = 'no_working_days';
    message = 'No working days were selected for this vacation';
}

export class VacationNotFoundException extends BaseException {
    name = 'vacation_not_found';
    message = 'There is no vacation with the given id';
}
