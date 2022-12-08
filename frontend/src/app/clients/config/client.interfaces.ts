import { ClientDto } from '@dtos/client-dto';
import { UpdateClientDto } from '@dtos/update-client-dto';
import { IFormModalData } from '@shared/config/constants/shared.interfaces';

export interface ClientUpdateFormModalData extends IFormModalData<UpdateClientDto> {
    client: ClientDto;
}
