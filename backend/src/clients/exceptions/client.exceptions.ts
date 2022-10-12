import { BaseException } from '@shared/models/base-exception/base-exception';

export class DuplicateClientNameException extends BaseException {
    name = 'duplicate_client_name';
    message = 'A client with this name already exists';

    constructor() {
        super( 'name' );
    }
}

export class ClientNotFoundException extends BaseException {
    name = 'client_not_found';
    message = 'No client was found with the given input';
}
