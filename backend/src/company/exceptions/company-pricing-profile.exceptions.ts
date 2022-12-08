import { BaseException } from '@shared/models/base-exception/base-exception';

export class DuplicateCompanyPricingProfileNameException extends BaseException {
    name = 'duplicate_company_pricing_profile_name';
    message = 'A company pricing profile with this name already exists';
}

export class NotEnoughDataForCompanyPricingProfileException extends BaseException {
    name = 'not_enough_data_for_company_pricing_profile';
    message = '';
}

export class CompanyPricingProfileNotFoundException extends BaseException {
    name = 'company_pricing_profile_not_found';
    message = 'Company pricing profile was not found';
    field = 'pricingProfileId';
}
