import { BaseException } from '@shared/models/base-exception/base-exception';

export class WorkLogNotFoundException extends BaseException {
    name = 'work_log_not_found';
    message = 'No work log was found with the given id';
}
