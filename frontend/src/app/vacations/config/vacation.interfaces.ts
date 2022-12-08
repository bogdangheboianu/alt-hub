import { VacationDto } from '@dtos/vacation-dto';
import { IFormModalData } from '@shared/config/constants/shared.interfaces';
import { CreateVacationRequest, UpdateVacationRequest } from '@vacations/config/vacation.types';

export interface VacationCreateFormModalData extends IFormModalData<CreateVacationRequest> {
}

export interface VacationUpdateFormModalData extends IFormModalData<UpdateVacationRequest> {
    initialValues: VacationDto;
    onDelete: () => any;
}

export interface VacationsByTimePeriod {
    past: VacationDto[];
    ongoing: VacationDto[];
    future: VacationDto[];
}

