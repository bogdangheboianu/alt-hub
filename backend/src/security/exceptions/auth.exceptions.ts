import { BaseException } from '@shared/models/base-exception/base-exception';

export class InvalidLoginCredentialsException extends BaseException {
    name = 'invalid_login_credentials';
    message = 'Invalid username/email or password';
}
