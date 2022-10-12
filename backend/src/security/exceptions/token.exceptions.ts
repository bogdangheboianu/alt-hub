import { BaseException } from '@shared/models/base-exception/base-exception';

export class DuplicateTokenValueException extends BaseException {
    name = 'duplicate_token_value';
    message = 'A token with this value already exists';
}

export class InvalidOrExpiredTokenException extends BaseException {
    name = 'invalid_or_expired_token';
    message = 'The provided token is either invalid or expired';
}

export class InvalidNonActiveTokenStatusException extends BaseException {
    name = 'invalid_non_active_token_status';
    message = 'The provided token status is not a non active status';
}
