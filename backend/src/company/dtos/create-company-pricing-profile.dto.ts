import { MoneyDto } from '@shared/dtos/money.dto';

export class CreateCompanyPricingProfileDto {
    name!: string;
    positionId?: string | null;
    positionName?: string | null;
    hourlyRate!: MoneyDto;
}
