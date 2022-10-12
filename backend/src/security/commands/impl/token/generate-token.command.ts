import { GenerateTokenDto } from '@security/dtos/generate-token.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { PublicContext } from '@shared/models/context/public-context';

type CommandDataPayload = GenerateTokenDto;
type CommandData = { context: AuthenticatedContext | PublicContext; payload: CommandDataPayload };

export class GenerateTokenCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = GenerateTokenCommand.name;
    }
}
