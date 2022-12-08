import { UpdateProjectTimelineDto } from '@projects/dtos/update-project-timeline.dto';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = UpdateProjectTimelineDto & { projectId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateProjectTimelineCommand {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateProjectTimelineCommand.name;
    }
}
