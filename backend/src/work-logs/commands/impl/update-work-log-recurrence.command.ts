import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { UpdateWorkLogRecurrenceDto } from '@work-logs/dtos/update-work-log-recurrence.dto';

type CommandDataPayload = UpdateWorkLogRecurrenceDto & { id: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateWorkLogRecurrenceCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateWorkLogRecurrenceCommand.name;
    }
}
