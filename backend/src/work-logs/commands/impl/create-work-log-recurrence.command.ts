import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { CreateWorkLogRecurrenceDto } from '@work-logs/dtos/create-work-log-recurrence.dto';

type CommandDataPayload = CreateWorkLogRecurrenceDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateWorkLogRecurrenceCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateWorkLogRecurrenceCommand.name;
    }
}