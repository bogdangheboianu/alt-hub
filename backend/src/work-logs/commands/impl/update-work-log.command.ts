import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { UpdateWorkLogDto } from '@work-logs/dtos/update-work-log.dto';

type CommandDataPayload = UpdateWorkLogDto & { id: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateWorkLogCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateWorkLogCommand.name;
    }
}
