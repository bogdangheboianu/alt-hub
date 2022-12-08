import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = { id: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class DeleteWorkLogRecurrenceCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = DeleteWorkLogRecurrenceCommand.name;
    }
}
