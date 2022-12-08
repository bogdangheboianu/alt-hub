import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = { userId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class ReactivateUserCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = ReactivateUserCommand.name;
    }
}
