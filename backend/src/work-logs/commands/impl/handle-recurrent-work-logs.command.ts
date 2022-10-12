import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { InternalContext } from '@shared/models/context/internal-context';

type CommandDataPayload = null;
type CommandData = { context: InternalContext; payload: CommandDataPayload };

export class HandleRecurrentWorkLogsCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = HandleRecurrentWorkLogsCommand.name;
    }
}
