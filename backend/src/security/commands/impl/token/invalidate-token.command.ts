import { InvalidateTokenDto } from '@security/dtos/invalidate-token.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { PublicContext } from '@shared/models/context/public-context';

type CommandDataPayload = InvalidateTokenDto;
type CommandData = { context: AuthenticatedContext | PublicContext; payload: CommandDataPayload };

export class InvalidateTokenCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = InvalidateTokenCommand.name;
    }
}
