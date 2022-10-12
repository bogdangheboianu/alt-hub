import { BaseException } from '@shared/models/base-exception/base-exception';

export class DuplicateCompanyPositionNameException extends BaseException {
    name = 'duplicate_company_position_name';
    message = 'A company position with this name already exists';
}

export class CompanyPositionNotFoundException extends BaseException {
    name = 'company_position_not_found';
    message = 'Company position was not found';
}
