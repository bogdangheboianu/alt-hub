import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { InternalContext } from '@shared/models/context/internal-context';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';

type CommandDataPayload = { workLogRecurrence: WorkLogRecurrence };
type CommandData = { context: InternalContext; payload: CommandDataPayload };

export class SendWorkLogRecurrenceConfirmationEmailCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = SendWorkLogRecurrenceConfirmationEmailCommand.name;
    }
}
