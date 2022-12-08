import { BaseException } from '@shared/models/base-exception/base-exception';

export class DivisionByZeroException extends BaseException {
    name = 'division_by_zero';
    message = 'Division by zero is not allowed';
}

export class NegativeValueException extends BaseException {
    name = 'negative_value';
    message = 'Result of operation is negative';
}
