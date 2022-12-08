import { CreateCompanyPricingProfileDto } from '@dtos/create-company-pricing-profile-dto';
import { IFormModalData } from '@shared/config/constants/shared.interfaces';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { Observable } from 'rxjs';

export interface CompanyPricingProfileCreateFormModalData extends IFormModalData<CreateCompanyPricingProfileDto> {
    companyPositions$: Observable<SelectInputOptions>;
    companyPositionsLoading$: Observable<boolean>;
}
