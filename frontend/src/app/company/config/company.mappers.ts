import { CompanyPositionDto } from '@dtos/company-position-dto';
import { CompanyPricingProfileDto } from '@dtos/company-pricing-profile-dto';
import { ISelectInputOption, SelectInputOptions } from '@shared/ui/input/select-input.component';

export const companyPositionToSelectInputOption = (position: CompanyPositionDto): ISelectInputOption => (
    { id: position.id, name: position.name }
);

export const companyPricingProfileToSelectInputOption = (pricingProfile: CompanyPricingProfileDto): ISelectInputOption => (
    { id: pricingProfile.id, name: pricingProfile.name }
);

export const companyPositionsToSelectInputOptions = (positions: CompanyPositionDto[]): SelectInputOptions => positions.map( companyPositionToSelectInputOption );

export const companyPricingProfilesToSelectInputOptions = (pricingProfiles: CompanyPricingProfileDto[]): SelectInputOptions => pricingProfiles.map( companyPricingProfileToSelectInputOption );
