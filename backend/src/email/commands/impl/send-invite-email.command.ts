import { SendInviteEmailDto } from '@email/dtos/send-invite-email.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = SendInviteEmailDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class SendInviteEmailCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = SendInviteEmailCommand.name;
    }
}
