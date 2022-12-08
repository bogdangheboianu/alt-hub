import { CreateVacationRequestDto } from '@dtos/create-vacation-request-dto';
import { UpdateVacationRequestDto } from '@dtos/update-vacation-request-dto';
import { ClosedDateInterval } from '@shared/config/constants/shared.types';

export type CreateVacationRequest = Omit<CreateVacationRequestDto, 'fromDate' | 'toDate'> & { dateInterval: ClosedDateInterval };
export type UpdateVacationRequest = Omit<UpdateVacationRequestDto, 'fromDate' | 'toDate'> & { dateInterval: ClosedDateInterval };
