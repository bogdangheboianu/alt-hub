import { UpdateClientDto } from '@clients/dtos/update-client.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

export type CommandDataPayload = UpdateClientDto & { clientId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateClientCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateClientCommand.name;
    }
}
