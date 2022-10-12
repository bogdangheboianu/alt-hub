import { ClientDto } from '@dtos/client.dto';
import { CompanyPositionDto } from '@dtos/company-position.dto';
import { ISelectInputOption, SelectInputOptions } from '@shared/interfaces/select-input-option.interface';

export const companyPositionToSelectInputOption = (position: CompanyPositionDto): ISelectInputOption => (
    { id: position.id, name: position.name }
);

export const companyPositionsToSelectInputOptions = (positions: ClientDto[]): SelectInputOptions => positions.map( companyPositionToSelectInputOption );
