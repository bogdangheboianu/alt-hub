import { BaseException } from '@shared/models/base-exception/base-exception';

export class CompanyNotDefinedException extends BaseException {
    name = 'company_not_defined';
    message = 'Company is not defined in the database';
}
