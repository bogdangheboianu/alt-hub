import { CompanyPositionDto } from '@company/dtos/company-position.dto';

export class EmploymentInfoDto {
    employeeId!: string;
    companyPosition!: CompanyPositionDto | null;
    hiredOn!: Date;
    leftOn!: Date | null;
}
