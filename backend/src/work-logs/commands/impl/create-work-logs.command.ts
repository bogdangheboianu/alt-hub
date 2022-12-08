import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { CreateWorkLogsDto } from '@work-logs/dtos/create-work-logs.dto';

type CommandDataPayload = CreateWorkLogsDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateWorkLogsCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateWorkLogsCommand.name;
    }
}
