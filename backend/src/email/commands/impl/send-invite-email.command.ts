import { Token } from '@security/models/token/token';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { User } from '@users/models/user';

type CommandDataPayload = { userRecipient: User; accountActivationToken: Token };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class SendInviteEmailCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = SendInviteEmailCommand.name;
    }
}
