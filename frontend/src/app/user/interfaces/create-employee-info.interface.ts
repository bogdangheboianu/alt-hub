import { CompanyPositionDto } from '@dtos/company-position.dto';

export interface ICreateEmployeeInfo {
    companyPositionId: CompanyPositionDto | string;
    hiredOn: Date;
}
