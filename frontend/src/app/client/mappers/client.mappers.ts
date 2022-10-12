import { ClientDto } from '@dtos/client.dto';
import { ISelectInputOption, SelectInputOptions } from '@shared/interfaces/select-input-option.interface';

export const clientToSelectInputOption = (client: ClientDto): ISelectInputOption => (
    { id: client.id, name: client.name }
);

export const clientsToSelectInputOptions = (clients: ClientDto[]): SelectInputOptions => clients.map( clientToSelectInputOption );
