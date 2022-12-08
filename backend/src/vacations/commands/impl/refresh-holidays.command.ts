import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { InternalContext } from '@shared/models/context/internal-context';

type CommandDataPayload = {};
type CommandData = { context: InternalContext; payload: CommandDataPayload };

export class RefreshHolidaysCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = RefreshHolidaysCommand.name;
    }
}
