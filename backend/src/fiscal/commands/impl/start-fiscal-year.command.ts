import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = {};
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class StartFiscalYearCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = StartFiscalYearCommand.name;
    }
}
