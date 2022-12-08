import { ClientDto } from '@dtos/client-dto';
import { ISelectInputOption, SelectInputOptions } from '@shared/ui/input/select-input.component';

export const clientToSelectInputOption = (client: ClientDto): ISelectInputOption => (
    { id: client.id, name: client.name }
);

export const clientsToSelectInputOptions = (clients: ClientDto[]): SelectInputOptions => clients.map( clientToSelectInputOption );
