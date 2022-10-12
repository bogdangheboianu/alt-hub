import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { CreateWorkLogDto } from '@work-logs/dtos/create-work-log.dto';

type CommandDataPayload = CreateWorkLogDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateWorkLogCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateWorkLogCommand.name;
    }
}
