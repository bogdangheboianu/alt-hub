import { ProjectPricingType } from '@projects/models/project-pricing-type';
import { OptionalMoney } from '@shared/models/money/optional-money';

export interface IProjectPricing {
    type?: ProjectPricingType;
    hourlyRate?: OptionalMoney;
    fixedPrice?: OptionalMoney;
}
