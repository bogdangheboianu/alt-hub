import { BaseException } from '@shared/models/base-exception/base-exception';

export class HolidayApiException extends BaseException {
    constructor(name?: string | null, message?: string | null) {
        super();
        this.name = name ?? 'holiday_api_exception';
        this.message = message ?? 'Something went wrong';
    }
}
