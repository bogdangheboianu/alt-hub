import { BaseException } from '@shared/models/base-exception/base-exception';

export class FileNotFoundException extends BaseException {
    name = 'file_not_found';
    message = 'No file was found with the given input';
}
