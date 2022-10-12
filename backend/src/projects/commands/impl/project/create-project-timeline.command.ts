import { CreateProjectTimelineDto } from '@projects/dtos/create-project-timeline.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = CreateProjectTimelineDto & { projectId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateProjectTimelineCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateProjectTimelineCommand.name;
    }
}
