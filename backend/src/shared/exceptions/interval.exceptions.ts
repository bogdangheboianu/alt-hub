import { BaseException } from '@shared/models/base-exception/base-exception';

export class UndefinedIntervalException extends BaseException {
    name = 'undefined_interval';

    constructor(fromPropertyName = 'from', toPropertyName = 'string') {
        super();
        this.message = `Invalid interval; at least one of ${ fromPropertyName } or ${ toPropertyName } must be set`;
    }
}

export class InvalidIntervalException extends BaseException {
    name = 'invalid_interval';

    constructor(fromPropertyName = 'from', toPropertyName = 'to') {
        super( fromPropertyName );
        this.message = `Invalid interval; ${ fromPropertyName } is not before ${ toPropertyName }`;
    }
}
