import { CompanyPositionDto } from '@company/dtos/company-position.dto';
import { AuditDto } from '@shared/dtos/audit.dto';
import { MoneyDto } from '@shared/dtos/money.dto';

export class CompanyPricingProfileDto {
    id!: string;
    name!: string;
    position!: CompanyPositionDto;
    hourlyRate!: MoneyDto;
    audit!: AuditDto;
}
