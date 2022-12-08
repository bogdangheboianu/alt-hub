import { BaseException } from '@shared/models/base-exception/base-exception';

export class FiscalYearNotFoundException extends BaseException {
    name = 'fiscal_year_not_found';
    message = 'Fiscal year not found';
}
