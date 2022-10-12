import { HttpStatus } from '@nestjs/common';
import { camelCase, startCase } from 'lodash';

export function statusCodeToErrorName(statusCode: number) {
    return startCase( camelCase( HttpStatus[statusCode] ) );
}

export function statusCodeToErrorCode(statusCode: number) {
    return camelCase( HttpStatus[statusCode] );
}
